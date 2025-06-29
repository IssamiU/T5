import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => 
    Promise.resolve(fn(req, res, next)).catch(next);

app.get('/clientes', asyncHandler(async (req, res) => {
  const clientes = await prisma.cliente.findMany({
    include: { pets: true, endereco: true, telefones: true }
  });
  res.json(clientes);
}));

app.get('/clientes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(id) },
    include: { pets: true, endereco: true, telefones: true }
  });
  if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });
  res.json(cliente);
}));

app.post('/clientes', asyncHandler(async (req, res) => {
  const { nome, nomeSocial, email, endereco, telefones, pets } = req.body;
  const cliente = await prisma.cliente.create({
    data: {
      nome,
      nomeSocial,
      email,
      endereco: { create: endereco },
      telefones: { createMany: { data: telefones } },
      pets: { create: pets }
    },
    include: { pets: true, endereco: true, telefones: true }
  });
  res.status(201).json(cliente);
}));

app.put('/clientes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome, nomeSocial, email, endereco, telefones } = req.body;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: { endereco: true, telefones: true }
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    const clienteAtualizado = await prisma.$transaction(async (prisma) => {
      const cliente = await prisma.cliente.update({
        where: { id: Number(id) },
        data: {
          nome,
          nomeSocial,
          email
        }
      });

      if (endereco) {
        if (clienteExistente.endereco) {
          await prisma.endereco.update({
            where: { clienteId: Number(id) },
            data: {
              estado: endereco.estado,
              cidade: endereco.cidade,
              bairro: endereco.bairro,
              rua: endereco.rua,
              numero: endereco.numero,
              codigoPostal: endereco.codigoPostal,
              informacoesAdicionais: endereco.informacoesAdicionais
            }
          });
        } else {
          await prisma.endereco.create({
            data: {
              ...endereco,
              clienteId: Number(id)
            }
          });
        }
      }

      if (telefones && telefones.length > 0) {
        await prisma.telefone.deleteMany({
          where: { clienteId: Number(id) }
        });

        await prisma.telefone.createMany({
          data: telefones.map((tel: any) => ({
            ddd: tel.ddd,
            numero: tel.numero,
            clienteId: Number(id)
          }))
        });
      }

      return await prisma.cliente.findUnique({
        where: { id: Number(id) },
        include: {
          endereco: true,
          telefones: true,
          pets: true
        }
      });
    });

    res.json(clienteAtualizado);
      } catch (error) {
      let errorMessage = 'Erro ao atualizar cliente';
      
      if (error instanceof Error) {
        errorMessage += `: ${error.message}`;
        console.error('Erro detalhado ao atualizar cliente:', error.stack);
      } else {
        console.error('Erro desconhecido ao atualizar cliente:', error);
      }
      
      res.status(500).json({ 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
}));


app.delete('/clientes/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: Number(id) },
      include: { endereco: true, telefones: true, pets: true }
    });

    if (!clienteExistente) {
      return res.status(404).json({ error: "Cliente não encontrado" });
    }

    await prisma.$transaction(async (prisma) => {
      await prisma.telefone.deleteMany({
        where: { clienteId: Number(id) }
      });

      await prisma.pet.deleteMany({
        where: { clienteId: Number(id) }
      });

      if (clienteExistente.endereco) {
        await prisma.endereco.delete({
          where: { clienteId: Number(id) }
        });
      }

      await prisma.cliente.delete({
        where: { id: Number(id) }
      });
    });

    res.status(204).send();
  } catch (error) {
    let errorMessage = 'Erro ao excluir cliente';
    let details = 'Erro desconhecido';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      details = error.message;
      console.error('Erro detalhado ao excluir cliente:', error.stack);
    } else {
      console.error('Erro desconhecido ao excluir cliente:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: details
    });
  }
}));


app.get('/produtos', asyncHandler(async (req, res) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
}));

app.get('/produtos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const produto = await prisma.produto.findUnique({
    where: { id: Number(id) }
  });
  if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(produto);
}));

app.post('/produtos', asyncHandler(async (req, res) => {
  const { nome, preco } = req.body;
  const produto = await prisma.produto.create({ data: { nome, preco } });
  res.status(201).json(produto);
}));

app.put('/produtos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  const produto = await prisma.produto.update({
    where: { id: Number(id) },
    data: { nome, preco }
  });
  res.json(produto);
}));

app.delete('/produtos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.produto.delete({
    where: { id: Number(id) }
  });
  res.status(204).send();
}));

app.get('/servicos', asyncHandler(async (req, res) => {
  const servicos = await prisma.servico.findMany();
  res.json(servicos);
}));

app.get('/servicos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const servico = await prisma.servico.findUnique({
    where: { id: Number(id) }
  });
  if (!servico) return res.status(404).json({ error: "Serviço não encontrado" });
  res.json(servico);
}));

app.post('/servicos', asyncHandler(async (req, res) => {
  const { nome, preco } = req.body;
  const servico = await prisma.servico.create({ data: { nome, preco } });
  res.status(201).json(servico);
}));

app.put('/servicos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome, preco } = req.body;
  const servico = await prisma.servico.update({
    where: { id: Number(id) },
    data: { nome, preco }
  });
  res.json(servico);
}));

app.delete('/servicos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.servico.delete({
    where: { id: Number(id) }
  });
  res.status(204).send();
}));

app.get('/pets/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  try {
    const pet = await prisma.pet.findUnique({
      where: { id: Number(id) }
    });
    
    if (!pet) {
      return res.status(404).json({ error: "Pet não encontrado" });
    }
    
    res.json(pet);
  } catch (error) {
    let errorMessage = 'Erro ao buscar pet';
    let details = 'Erro desconhecido';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      details = error.message;
      console.error('Erro detalhado ao buscar pet:', error.stack);
    } else {
      console.error('Erro desconhecido ao buscar pet:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: details
    });
  }
}));

app.get('/pets/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pet = await prisma.pet.findUnique({
    where: { id: Number(id) }
  });
  if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
  res.json(pet);
}));

app.get('/pets/cliente/:clienteId', asyncHandler(async (req, res) => {
  const { clienteId } = req.params;
  const pets = await prisma.pet.findMany({
    where: { clienteId: Number(clienteId) }
  });
  res.json(pets);
}));

app.post('/pets', asyncHandler(async (req, res) => {
  const { nome, tipo, raca, genero, clienteId } = req.body;
  const pet = await prisma.pet.create({
    data: {
      nome,
      tipo,
      raca,
      genero,
      clienteId: Number(clienteId)
    }
  });
  res.status(201).json(pet);
}));

app.put('/pets/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nome, tipo, raca, genero, clienteId } = req.body;
  const pet = await prisma.pet.update({
    where: { id: Number(id) },
    data: {
      nome,
      tipo,
      raca,
      genero,
      clienteId: Number(clienteId)
    }
  });
  res.json(pet);
}));

app.delete('/pets/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.pet.delete({
    where: { id: Number(id) }
  });
  res.status(204).send();
}));

app.get('/consumos', asyncHandler(async (req, res) => {
  const consumos = await prisma.consumo.findMany({
    include: {
      cliente: { select: { id: true, nome: true } },
      produto: { select: { id: true, nome: true, preco: true } },
      servico: { select: { id: true, nome: true, preco: true } }
    },
    orderBy: { data: 'desc' }
  });
  res.json(consumos);
}));

app.get('/consumos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const consumo = await prisma.consumo.findUnique({
    where: { id: Number(id) },
    include: {
      cliente: { select: { id: true, nome: true } },
      produto: { select: { id: true, nome: true, preco: true } },
      servico: { select: { id: true, nome: true, preco: true } }
    }
  });
  if (!consumo) return res.status(404).json({ error: "Consumo não encontrado" });
  res.json(consumo);
}));

app.post('/consumos', asyncHandler(async (req, res) => {
  const { clienteId, produtoId, servicoId, quantidade, data } = req.body;
  
  if (!clienteId || (!produtoId && !servicoId) || !quantidade || !data) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(clienteId) }
  });
  if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

  let itemNome = '';
  let itemTipo = '';
  let precoUnitario = 0;
  let valorTotal = 0;

  if (produtoId) {
    const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    
    itemNome = produto.nome;
    itemTipo = 'produto';
    precoUnitario = produto.preco;
    valorTotal = produto.preco * quantidade;
  } 
  
  if (servicoId) {
    const servico = await prisma.servico.findUnique({ where: { id: servicoId } });
    if (!servico) return res.status(404).json({ error: "Serviço não encontrado" });
    
    itemNome = servico.nome;
    itemTipo = 'servico';
    precoUnitario = servico.preco;
    valorTotal = servico.preco * quantidade;
  }

  const consumo = await prisma.consumo.create({
    data: {
      clienteId: Number(clienteId),
      produtoId: produtoId || null,
      servicoId: servicoId || null,
      quantidade: Number(quantidade),
      valorTotal: Number(valorTotal.toFixed(2)),
      data: new Date(data).toISOString(),
      
      itemNome,
      itemTipo,
      precoUnitario
    }
  });
  
  res.status(201).json(consumo);
}));


app.put('/consumos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { clienteId, produtoId, servicoId, quantidade, data } = req.body;
  
  if (!clienteId || (!produtoId && !servicoId) || !quantidade || !data) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(clienteId) }
  });
  if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

  let itemNome = '';
  let itemTipo = '';
  let precoUnitario = 0;
  let valorTotal = 0;

  if (produtoId) {
    const produto = await prisma.produto.findUnique({ where: { id: produtoId } });
    if (!produto) return res.status(404).json({ error: "Produto não encontrado" });
    
    itemNome = produto.nome;
    itemTipo = 'produto';
    precoUnitario = produto.preco;
    valorTotal = produto.preco * quantidade;
  } 
  
  if (servicoId) {
    const servico = await prisma.servico.findUnique({ where: { id: servicoId } });
    if (!servico) return res.status(404).json({ error: "Serviço não encontrado" });
    
    itemNome = servico.nome;
    itemTipo = 'servico';
    precoUnitario = servico.preco;
    valorTotal = servico.preco * quantidade;
  }

  const updatedConsumo = await prisma.consumo.update({
    where: { id: Number(id) },
    data: {
      clienteId: Number(clienteId),
      produtoId: produtoId || null,
      servicoId: servicoId || null,
      quantidade: Number(quantidade),
      valorTotal: Number(valorTotal.toFixed(2)),
      data: new Date(data).toISOString(),
      
      itemNome,
      itemTipo,
      precoUnitario
    }
  });
  
  res.json(updatedConsumo);
}));


app.delete('/consumos/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.consumo.delete({
    where: { id: Number(id) }
  });
  res.status(204).send();
}));

app.get('/relatorios/top-clientes-quantidade', asyncHandler(async (req, res) => {
  try {
    const topClientsByQuantity = await prisma.consumo.groupBy({
      by: ['clienteId'],
      _sum: {
        quantidade: true
      },
      orderBy: {
        _sum: {
          quantidade: 'desc'
        }
      },
      take: 10
    });

    const topClientsWithNames = await Promise.all(
      topClientsByQuantity.map(async (item) => {
        const cliente = await prisma.cliente.findUnique({ 
          where: { id: item.clienteId },
          select: { nome: true }
        });
        return {
          nome: cliente?.nome || 'Cliente Desconhecido',
          quantidade: item._sum.quantidade || 0
        };
      })
    );

    res.json(topClientsWithNames);
  } catch (error) {
    let errorMessage = 'Erro ao gerar relatório de top clientes por quantidade';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Erro detalhado:', error.stack);
    } else {
      console.error('Erro desconhecido:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}));

app.get('/relatorios/top-clientes-valor', asyncHandler(async (req, res) => {
  try {
    const topClientsByValue = await prisma.consumo.groupBy({
      by: ['clienteId'],
      _sum: {
        valorTotal: true
      },
      orderBy: {
        _sum: {
          valorTotal: 'desc'
        }
      },
      take: 5
    });

    const topClientsWithNames = await Promise.all(
      topClientsByValue.map(async (item) => {
        const cliente = await prisma.cliente.findUnique({ 
          where: { id: item.clienteId },
          select: { nome: true }
        });
        return {
          nome: cliente?.nome || 'Cliente Desconhecido',
          totalGasto: Number(item._sum.valorTotal) || 0
        };
      })
    );

    res.json(topClientsWithNames);
  } catch (error) {
    let errorMessage = 'Erro ao gerar relatório de top clientes por valor';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Erro detalhado:', error.stack);
    } else {
      console.error('Erro desconhecido:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}));


app.get('/relatorios/itens-mais-consumidos', asyncHandler(async (req, res) => {
  try {
    const produtosConsumidos = await prisma.consumo.groupBy({
      by: ['produtoId'],
      where: {
        produtoId: {
          not: null
        }
      },
      _sum: {
        quantidade: true
      },
      orderBy: {
        _sum: {
          quantidade: 'desc'
        }
      },
      take: 10
    });

    const servicosConsumidos = await prisma.consumo.groupBy({
      by: ['servicoId'],
      where: {
        servicoId: {
          not: null
        }
      },
      _sum: {
        quantidade: true
      },
      orderBy: {
        _sum: {
          quantidade: 'desc'
        }
      },
      take: 10
    });

    const produtosComNomes = await Promise.all(
      produtosConsumidos.map(async (item) => {
        const produto = await prisma.produto.findUnique({
          where: { id: item.produtoId! },
          select: { nome: true }
        });
        return {
          nome: produto?.nome || 'Produto Desconhecido',
          tipo: 'produto',
          quantidade: item._sum.quantidade || 0
        };
      })
    );

    const servicosComNomes = await Promise.all(
      servicosConsumidos.map(async (item) => {
        const servico = await prisma.servico.findUnique({
          where: { id: item.servicoId! },
          select: { nome: true }
        });
        return {
          nome: servico?.nome || 'Serviço Desconhecido',
          tipo: 'servico',
          quantidade: item._sum.quantidade || 0
        };
      })
    );

    const todosItens = [...produtosComNomes, ...servicosComNomes]
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 10);

    res.json(todosItens);
  } catch (error) {
    let errorMessage = 'Erro ao gerar relatório de itens mais consumidos';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Erro detalhado:', error.stack);
    } else {
      console.error('Erro desconhecido:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}));

app.get('/relatorios/itens-por-tipo-raca-pet', asyncHandler(async (req, res) => {
  try {
    const consumos = await prisma.consumo.findMany({
      include: {
        cliente: {
          include: {
            pets: true
          }
        },
        produto: {
          select: { nome: true }
        },
        servico: {
          select: { nome: true }
        }
      }
    });

    const resultados = new Map();

    consumos.forEach(consumo => {
      if (consumo.cliente.pets && consumo.cliente.pets.length > 0) {
        consumo.cliente.pets.forEach(pet => {
          const chave = `${pet.tipo}-${pet.raca || 'Sem raça'}`;
          
          if (!resultados.has(chave)) {
            resultados.set(chave, {
              tipoPet: pet.tipo,
              racaPet: pet.raca || 'Sem raça',
              itens: new Map()
            });
          }

          const grupo = resultados.get(chave);
          const nomeItem = consumo.produto?.nome || consumo.servico?.nome || 'Item Desconhecido';
          const tipoItem = consumo.produto ? 'produto' : 'servico';
          const chaveItem = `${nomeItem}-${tipoItem}`;

          if (!grupo.itens.has(chaveItem)) {
            grupo.itens.set(chaveItem, {
              nome: nomeItem,
              tipo: tipoItem,
              quantidade: 0
            });
          }

          grupo.itens.get(chaveItem).quantidade += consumo.quantidade;
        });
      }
    });

    const resposta = Array.from(resultados.values()).map(grupo => ({
      tipoPet: grupo.tipoPet,
      racaPet: grupo.racaPet,
      itens: (Array.from(grupo.itens.values()) as { quantidade: number }[])
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, 5)
    })).filter(grupo => grupo.itens.length > 0);


    res.json(resposta);
  } catch (error) {
    let errorMessage = 'Erro ao gerar relatório de itens por tipo e raça de pet';
    
    if (error instanceof Error) {
      errorMessage += `: ${error.message}`;
      console.error('Erro detalhado:', error.stack);
    } else {
      console.error('Erro desconhecido:', error);
    }
    
    res.status(500).json({ 
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
}));

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
