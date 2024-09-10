// VO = Value Object, isso é um objeto que VAI ser percorrido pela WEB, é uma boa prática declarar dessa forma
// Estou tipando Category VO com as variaveis que ficam dentro da tabela Categoria
// Nesse caso:

export type CustomerVO = {
    id: string  //Se torna uma string
    nome: string     //Se torna uma string
    nomeFantasia: string
    cpfCnpj:string
    email:string
    telefone:string
    isFornecedor:string
    dataCadastro:string
    numIe:string
    statusIe:string
    endereco:string
    cep:string
    estado:string
    numero:string
    cidade:string
    complemento:string
}

//proximo passo é index.ts