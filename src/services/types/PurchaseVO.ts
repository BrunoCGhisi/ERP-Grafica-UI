// VO = Value Object, isso é um objeto que VAI ser percorrido pela WEB, é uma boa prática declarar dessa forma
// Estou tipando Category VO com as variaveis que ficam dentro da tabela Categoria
// Nesse caso:

export type PurchaseVO = {
    id:           string  //Se torna uma string
    idFornedor:   string  //Se torna uma string
    isCompraOS:   string
    dataCompra:   string
    numNota:      string
    desconto:     string
}

//proximo passo é index.ts