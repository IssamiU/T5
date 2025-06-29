import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.consumo.deleteMany();
  await prisma.pet.deleteMany();
  await prisma.telefone.deleteMany();
  await prisma.endereco.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.servico.deleteMany();

  console.log('Dados existentes removidos');

  const produto1 = await prisma.produto.create({
    data: { nome: 'Ração Premium Cachorro', preco: 150.00 }
  });
  const produto2 = await prisma.produto.create({
    data: { nome: 'Brinquedo Bolinha', preco: 25.00 }
  });
  const produto3 = await prisma.produto.create({
    data: { nome: 'Ração Gato Filhote', preco: 120.00 }
  });

  console.log('Produtos criados');

  const servico1 = await prisma.servico.create({
    data: { nome: 'Banho e Tosa', preco: 80.00 }
  });
  const servico2 = await prisma.servico.create({
    data: { nome: 'Consulta Veterinária', preco: 200.00 }
  });
  const servico3 = await prisma.servico.create({
    data: { nome: 'Vacinação', preco: 150.00 }
  });

  console.log('Serviços criados');

  const clientes = [
    {
      nome: 'Fernando Massanori',
      nomeSocial: 'Fernando',
      email: 'fernando.massanori@email.com',
      endereco: {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Jardim Paulista',
        rua: 'Rua Augusta',
        numero: '1000',
        codigoPostal: '01412-000',
        informacoesAdicionais: 'Apto 101'
      },
      telefones: [{ ddd: '11', numero: '999999001' }],
      pets: [
        { nome: 'Toby', tipo: 'Cachorro', raca: 'Labrador', genero: 'Macho' }
      ]
    },
    {
      nome: 'Reinaldo Arakaki',
      nomeSocial: 'Reinaldo',
      email: 'reinaldo.arakaki@email.com',
      endereco: {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Vila Mariana',
        rua: 'Rua Vergueiro',
        numero: '200',
        codigoPostal: '04101-000',
        informacoesAdicionais: 'Casa'
      },
      telefones: [{ ddd: '11', numero: '999999002' }],
      pets: [
        { nome: 'Mimi', tipo: 'Gato', raca: 'Siamês', genero: 'Fêmea' }
      ]
    },
    {
      nome: 'Juliana Martinez',
      nomeSocial: 'Juliana',
      email: 'juliana.martinez@email.com',
      endereco: {
        estado: 'RJ',
        cidade: 'Rio de Janeiro',
        bairro: 'Copacabana',
        rua: 'Avenida Atlântica',
        numero: '300',
        codigoPostal: '22040-000',
        informacoesAdicionais: 'Cobertura'
      },
      telefones: [{ ddd: '21', numero: '999999003' }],
      pets: [
        { nome: 'Luna', tipo: 'Gato', raca: 'Persa', genero: 'Fêmea' }
      ]
    },
    {
      nome: 'Claudio Lima',
      nomeSocial: 'Claudio',
      email: 'claudio.lima@email.com',
      endereco: {
        estado: 'MG',
        cidade: 'Belo Horizonte',
        bairro: 'Savassi',
        rua: 'Rua da Bahia',
        numero: '400',
        codigoPostal: '30140-000',
        informacoesAdicionais: 'Apto 202'
      },
      telefones: [{ ddd: '31', numero: '999999004' }],
      pets: [
        { nome: 'Rex', tipo: 'Cachorro', raca: 'Bulldog', genero: 'Macho' }
      ]
    },
    {
      nome: 'Gerson Neto',
      nomeSocial: 'Gerson',
      email: 'gerson.neto@email.com',
      endereco: {
        estado: 'RS',
        cidade: 'Porto Alegre',
        bairro: 'Moinhos de Vento',
        rua: 'Rua Padre Chagas',
        numero: '500',
        codigoPostal: '90430-000',
        informacoesAdicionais: 'Casa'
      },
      telefones: [{ ddd: '51', numero: '999999005' }],
      pets: [
        { nome: 'Bela', tipo: 'Cachorro', raca: 'Poodle', genero: 'Fêmea' }
      ]
    },
    {
      nome: 'Jose Walmir',
      nomeSocial: 'Jose',
      email: 'jose.walmir@email.com',
      endereco: {
        estado: 'PR',
        cidade: 'Curitiba',
        bairro: 'Batel',
        rua: 'Rua XV de Novembro',
        numero: '600',
        codigoPostal: '80420-000',
        informacoesAdicionais: 'Apto 303'
      },
      telefones: [{ ddd: '41', numero: '999999006' }],
      pets: [
        { nome: 'Nina', tipo: 'Gato', raca: 'Maine Coon', genero: 'Fêmea' }
      ]
    },
    {
      nome: 'Issami Umeoka',
      nomeSocial: 'Issami',
      email: 'issami.umeoka@email.com',
      endereco: {
        estado: 'SP',
        cidade: 'São José dos Campos',
        bairro: 'Vila Industrial',
        rua: 'Jamil Cury',
        numero: '20',
        codigoPostal: '12220281',
        informacoesAdicionais: 'Casa amarela'
      },
      telefones: [{ ddd: '12', numero: '988992109' }],
      pets: [
        { nome: 'AUAU', tipo: 'Cachorro', raca: 'Vira-Lata', genero: 'Macho' }
      ]
    },
    {
      nome: 'Yasmin Nunes',
      nomeSocial: 'Yasmin',
      email: 'yasmin.nunes@email.com',
      endereco: {
        estado: 'SP',
        cidade: 'Campinas',
        bairro: 'Cambuí',
        rua: 'Rua dos Alecrins',
        numero: '700',
        codigoPostal: '13025000',
        informacoesAdicionais: 'Casa com jardim'
      },
      telefones: [{ ddd: '19', numero: '999999007' }],
      pets: [
        { nome: 'Max', tipo: 'Cachorro', raca: 'Beagle', genero: 'Macho' }
      ]
    },
    {
      nome: 'Otávio Vianna',
      nomeSocial: 'Otávio',
      email: 'otavio.vianna@email.com',
      endereco: {
        estado: 'RJ',
        cidade: 'Niterói',
        bairro: 'Icaraí',
        rua: 'Rua Moreira César',
        numero: '800',
        codigoPostal: '24230000',
        informacoesAdicionais: 'Apartamento 101'
      },
      telefones: [{ ddd: '21', numero: '999999008' }],
      pets: [
        { nome: 'Lola', tipo: 'Gato', raca: 'Sphynx', genero: 'Fêmea' }
      ]
    },
    {
      nome: 'Tiago Freitas',
      nomeSocial: 'Tiago',
      email: 'tiago.freitas@email.com',
      endereco: {
        estado: 'SP',
        cidade: 'São Paulo',
        bairro: 'Pinheiros',
        rua: 'Rua dos Pinheiros',
        numero: '900',
        codigoPostal: '05422000',
        informacoesAdicionais: 'Cobertura'
      },
      telefones: [{ ddd: '11', numero: '999999009' }],
      pets: [
        { nome: 'Zeus', tipo: 'Cachorro', raca: 'Pastor Alemão', genero: 'Macho' }
      ]
    }
  ];

  const clientesCriados = [];
  for (const cliente of clientes) {
    const novoCliente = await prisma.cliente.create({
      data: {
        nome: cliente.nome,
        nomeSocial: cliente.nomeSocial,
        email: cliente.email,
        endereco: {
          create: cliente.endereco
        },
        telefones: {
          createMany: {
            data: cliente.telefones
          }
        },
        pets: {
          create: cliente.pets
        }
      },
      include: {
        pets: true
      }
    });
    clientesCriados.push(novoCliente);
  }

  console.log('Clientes e pets criados');

  const produtos = [produto1, produto2, produto3];
  const servicos = [servico1, servico2, servico3];

  for (const cliente of clientesCriados) {

    const numConsumos = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < numConsumos; i++) {

      const isProduto = Math.random() > 0.5;
      const item = isProduto
        ? produtos[Math.floor(Math.random() * produtos.length)]
        : servicos[Math.floor(Math.random() * servicos.length)];
      
      const quantidade = Math.floor(Math.random() * 3) + 1; 
      const valorTotal = item.preco * quantidade;
      
      const data = new Date();
      data.setMonth(data.getMonth() - Math.floor(Math.random() * 6));
      data.setDate(Math.floor(Math.random() * 28) + 1);
      
      await prisma.consumo.create({
        data: {
          clienteId: cliente.id,
          produtoId: isProduto ? item.id : null,
          servicoId: !isProduto ? item.id : null,
          quantidade,
          valorTotal,
          data,
          itemNome: item.nome,
          itemTipo: isProduto ? 'produto' : 'servico',
          precoUnitario: item.preco
        }
      });
    }
  }

  console.log('Consumos aleatórios criados');
  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
