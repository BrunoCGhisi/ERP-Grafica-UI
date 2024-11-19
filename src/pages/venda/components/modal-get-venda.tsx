import {
    Box,
    Modal, TextField,
    Typography,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { vendaSchema, vendaSchemaType, vendaProdutoSchemaType, financeiroSchemaType } from "../../../shared/services/types";
import { GridRowParams } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    produtoSchemaType,
} from "../../../shared/services/types";

interface ModalGetVenda {
    open: boolean
    rowData: GridRowParams<any> | null
    toggleModal: () => void
    //loadSales: () => void
    clientes: {
        nome: string;
         id?: number | undefined;
     }[]
    // setAlertMessage: (alertMessage: string) => void
    // setShowAlert: (open: boolean) => void
    produtos: produtoSchemaType[]
    vendasProdutos: vendaProdutoSchemaType[]
    // setFormaPagamento: (value: React.SetStateAction<number>) => void
    // formaPagamento: number
    // bancos : {
    //     nome: string;
    //     valorTotal: number; 
    //     id?: number | undefined;
    // }[]
    // userId: number | null
    // idToEdit: any
    vendas: vendaSchemaType[],
    financeiro: financeiroSchemaType[]
}

export function ModalGetVenda({rowData, open, toggleModal, clientes, vendas, financeiro, produtos, vendasProdutos}: ModalGetVenda){
      
    
    const filterVendas = vendas.filter((venda) => venda.id === rowData?.row.id);
    const idVendas = filterVendas.map((venda) => venda.id);
   
    const venda_produto = vendasProdutos.filter((vp) => idVendas.includes(vp.idVenda));
    const cliente = clientes.filter((cliente) => cliente.id === filterVendas[0].idCliente);
    const financeiros = financeiro.filter((fin) => idVendas.includes(fin.idVenda));

    


    


    

    const { control } = useForm<vendaSchemaType>({
         resolver: zodResolver(vendaSchema),
         defaultValues: {
            vendas_produtos: venda_produto.map((vp) => ({ idProduto: vp?.idProduto, quantidade: vp?.quantidade }))
         }
        });
            
    const { fields } = useFieldArray({
        control,
        name: "vendas_produtos",
    });

    console.log("fields:", fields);
    console.log("produtos:", produtos);


    let formaPgto = "" 
    switch (financeiros[0].idFormaPgto) {
        case 1:
            formaPgto = "Dinheiro";
            break;
        case 2:
            formaPgto = "Débito"
            break;
        case 3:
            formaPgto = "Crédito"
            break;
        case 4:
            formaPgto = "PIX"
            break;
        case 5:
            formaPgto = "Boleto"
            break;
        case 6:
            formaPgto = "À prazo"
            break;
        case 7:
            formaPgto = "Cheque"
            break;
    }


    let situacao = ""
    switch (rowData?.row.situacao) {
        case 0:
            situacao = "Em espera";
            break;
        case 2:
            situacao = "Em execução"
            break;
        case 3:
            situacao = "Em acabamento"
            break;
        case 4:
            situacao = "Finalizado"
            break;
        case 1:
            situacao = "Em criação (arte)"
            break;
        case 5:
            situacao = "Entregue"
            break;
    }
    
    console.log(rowData?.row.dataAtual)

    return (
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot>

                <TextField
                    id="outlined-helperText"
                    label="Vendedor"
                    value={rowData?.row.idVendedor}
                    inputProps={{ readOnly: true }}
                    
                  />

                <TextField
                    id="outlined-helperText"
                    label="Clientes"
                    value={cliente[0].nome}
                    inputProps={{ readOnly: true }}
                    
                  />

                  <TextField
                    type="date"
                    id="outlined-helperText"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    value={(filterVendas[0].dataAtual)}
                    
                  />
                  <TextField
                    id="outlined-helperText"
                    label="Desconto"
                    
                    value={(rowData?.row.desconto)}
                  />

                <TextField
                    id="outlined-helperText"
                    label="Venda ou Ordem de Serviço"
                    value={rowData?.row.isVendaOS == 1 ? "Ordem de Serviço" : "Venda"}
                />

                <TextField
                    id="outlined-helperText"
                    label="Situação"
                    value={situacao}
                />

                <TextField
                    id="outlined-helperText"
                    label="Banco"
                    value={financeiros[0].idBanco}
                />

                <TextField
                    id="outlined-helperText"
                    label="Forma de Pagamento"
                    value={formaPgto}
                />

                <TextField
                    id="outlined-helperText"
                    label="Parcelas"
                    value={financeiros[0].parcelas}
                />

             
                  <Typography variant="h6">Produtos da Venda</Typography>
                  {fields.map((item) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                    <TextField
                        id="outlined-helperText"
                        label="Produtos"
                        value={produtos.find((produto) => produto.id === item.idProduto)?.nome || ""}
                    />
                    <TextField
                        id="outlined-helperText"
                        label="Quantidade"
                        value={item.quantidade}
                    />
                    </Box> ))}

              </ModalRoot>
            </Modal>
    )
}