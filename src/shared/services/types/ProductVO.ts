// VO = Value Object, isso é um objeto que VAI ser percorrido pela WEB, é uma boa prática declarar dessa forma
// Estou tipando Category VO com as variaveis que ficam dentro da tabela Categoria
// Nesse caso:

export type ProductVO = {
    id:           string  //Se torna uma string
    nome:   string  //Se torna uma string
    tipo:   string
    keyWord:   string
    idCategoria:      string
    preco:     string
    tamanho: string
    isEstoque:     string
    minEstoque:     string
    estoque:     string
}

//proximo passo é index.ts

