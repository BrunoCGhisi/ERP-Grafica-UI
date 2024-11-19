import {
    Box,
    InputLabel,
    Select,
    MenuItem,
    Modal,
    Button, TextField,
    Typography,
    IconButton
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { putSale, putSaleAux, putSaleFin } from "../../../shared/services";
import { VendaDataRow, vendaSchema, vendaSchemaType,vendaProdutoSchemaType, financeiroSchemaType } from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  produtoSchemaType,
} from "../../../shared/services/types";
import { z } from "zod";

interface ModalEditVenda {
    open: boolean
    toggleModal: () => void
    loadSales: () => void
    clientes: {
        nome: string;
        id?: number | undefined;
    }[]
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    produtos: produtoSchemaType[]
    vendasProdutos: vendaProdutoSchemaType[]
    setFormaPagamento: (value: React.SetStateAction<number>) => void
    formaPagamento: number
    bancos : {
        nome: string;
        valorTotal: number; 
        id?: number | undefined;
    }[]
    userId: number | null
    idToEdit: any
    vendas: vendaSchemaType[],
    financeiro: financeiroSchemaType[]
}

export function ModalEditVenda({open, loadSales, toggleModal, clientes, setAlertMessage, setShowAlert, produtos, setFormaPagamento, idToEdit, formaPagamento, userId, bancos, vendas, vendasProdutos, financeiro}: ModalEditVenda){
  
    //const today = new Date()
    const filterVendas = vendas.filter((venda) => venda.id === idToEdit);
    const idVendas = filterVendas.map((venda) => venda.id);
  
    const cliente = clientes.filter((cliente) => cliente.id === filterVendas[0]?.idCliente);
    const vendedor = vendas.find((venda) => venda.idVendedor === filterVendas[0]?.idVendedor);
    
    
    const venda_produto = vendasProdutos.filter((vp) => idVendas.includes(vp.idVenda));
    const financeiros = financeiro.filter((fin) => idVendas.includes(fin.idVenda));

    console.log("financeiro", filterVendas); 
    

    const {
        register,
        handleSubmit,
        reset,
        control, watch, setValue,
        formState: { errors },
        } = useForm<vendaSchemaType>({
        resolver: zodResolver(vendaSchema),
        defaultValues: {
          idCliente: cliente[0].id,
          desconto: filterVendas[0].desconto,
          situacao: filterVendas[0].situacao,
          isVendaOS: filterVendas[0].isVendaOS,
          dataAtual: dayjs(filterVendas[0].dataAtual).format("YYYY-MM-DD"),
          financeiro: financeiros.map((fin) => ({idBanco: fin.idBanco, idFormaPgto: fin.idFormaPgto, parcelas: fin.parcelas})),
          idVendedor: vendedor?.idVendedor,
          vendas_produtos: venda_produto.map((vp) => ({ idProduto: vp?.idProduto, quantidade: vp?.quantidade }))
        },
        });
        
        const handleAddProduct = () => { // pq usamos isso?
          append({ idProduto: 0, quantidade: 1 }); 
        };
        const { fields, append, remove } = useFieldArray({
          control,
          name: "vendas_produtos",
        });
        const handleRemoveProduct = (index: number) => {
          remove(index);
        };
    


  async function handleUpdate(data: vendaSchemaType){
    try {
      const newData = {...data, id: idToEdit}
      
      const response = await putSale(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadSales();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar venda ou produtos:", error)
    }
  }

  const waiter = watch("financeiro.0.idFormaPgto");  
  useEffect(() => {
    if (waiter === 0 || waiter === 1) {
      setValue("financeiro.0.parcelas", 1); // Atualiza o valor de parcelas
    }
   
  }, [waiter, setValue]);     

    return (
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot title="Editar venda">
                <form onSubmit={handleSubmit(handleUpdate)} style={{width: '100%'}}>
                <TextField
                    id="outlined-helperText"
                    label="Vendedor"
                    inputProps={{ readOnly: true }}
                    helperText={errors.idVendedor?.message || "Obrigatório"}
                    error={!!errors.idVendedor}
                    defaultValue={userId}
                    {...register("idVendedor")}
                  />

                  <InputLabel id="demo-simple-select-label">
                    Clientes
                  </InputLabel>

                  <Controller
                    name="idCliente"
                    control={control}
                    render={({ field }) => (
                      <Select
                        style={{ width: 300 }}
                        labelId="select-label"
                        id="demo-simple-select"
                        error={!!errors.idCliente}
                        {...field} 
                      >
                        {clientes &&
                          clientes.map((cliente) => (
                            <MenuItem key={cliente.id} value={cliente.id}>
                              {cliente.nome}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />

                  <TextField
                    type="date"
                    id="outlined-helperText"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.dataAtual?.message || "Obrigatório"}
                    error={!!errors.dataAtual}
                    {...register("dataAtual")}
                  />
                  <TextField
                    id="outlined-helperText"
                    label="Desconto"
                    defaultValue={0}
                    helperText={errors.desconto?.message || "Obrigatório"}
                    error={!!errors.desconto}
                    {...register("desconto", { valueAsNumber: true })}
                  />

                  <Controller
                    control={control}
                    name="isVendaOS"
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={0}>Compra</MenuItem>
                        <MenuItem value={1}>OS</MenuItem>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="situacao"
                    
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={0}>Em espera</MenuItem>
                        <MenuItem value={1}>Em criação (arte)</MenuItem>
                        <MenuItem value={2}>Em execução</MenuItem>
                        <MenuItem value={3}>Em acabamento</MenuItem>
                        <MenuItem value={4}>Finalizado</MenuItem>
                        <MenuItem value={5}>Entregue</MenuItem>
                      </Select>
                    )}
                  />

                  <InputLabel id="demo-simple-select-label">Banco</InputLabel>

                  <Controller
                    name={`financeiro.0.idBanco`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""} // Valor padrão do idBanco
                        onChange={(e) => field.onChange(e.target.value)}
                        style={{ width: 300 }}
                      >
                        {bancos?.map((banco) => (
                          <MenuItem key={banco.id} value={banco.id}>
                            {banco.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    )}/>

                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name={`financeiro.0.idFormaPgto`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={field.value || ""} // Valor padrão do idForma_pgto
                        onChange={(e) => field.onChange(e.target.value)}
                        style={{ width: 300 }}
                      >
                        <MenuItem value={1}>Dinheiro</MenuItem>
                        <MenuItem value={2}>Débito</MenuItem>
                        <MenuItem value={3}>Crédito</MenuItem>
                        <MenuItem value={4}>Pix</MenuItem>
                        <MenuItem value={5}>Boleto</MenuItem>
                        <MenuItem value={6}>À prazo</MenuItem>
                        <MenuItem value={7}>Cheque</MenuItem>
                      </Select>
                    )}
                  />

                  <Typography variant="h6">Produtos da Venda</Typography>
                  {fields.map((item, index) => (
                    <Box
                      key={item.id}
                      display="flex"
                      alignItems="center"
                      gap={2}
                    >
                      <Controller
                        control={control}
                        
                        name={`vendas_produtos.${index}.idProduto` as const}
                        //defaultValue={0}
                        render={({ field }) => (
                          <Select
                            {...field}
                            
                            error={!!errors.vendas_produtos?.[index]?.idProduto}
                          >
                            {produtos.map((produto) => (
                              <MenuItem key={produto.id} value={produto.id}>
                                
                                {produto.nome}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />

                      <TextField
                        {...register(
                          `vendas_produtos.${index}.quantidade` as const
                        )}
                        type="number"
                        error={!!errors.vendas_produtos?.[index]?.quantidade}
                        helperText={
                          errors.vendas_produtos?.[index]?.quantidade
                            ?.message 
                        }
                        label="Quantidade"
                        //defaultValue={1}
                        InputProps={{ inputProps: { min: 1 } }}
                      />

                      <IconButton
                        onClick={() => handleRemoveProduct(index)}
                        color="error"
                      >
                        <GridDeleteIcon />
                      </IconButton>
                    </Box>
                  ))}

                <Typography>Financeiro</Typography>
                  <TextField
                    label="Parcelas"
                    type="number"
                    //defaultValue={1 as number}
                    InputProps={{
                      readOnly: waiter === 0 || waiter === 1,
                    }}
                    {...register("financeiro.0.parcelas")}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleAddProduct}
                  >
                    Adicionar Produto
                  </Button>

                  <Button
                    type="submit"
                    variant="outlined"
                    startIcon={<DoneIcon />}
                  >
                    Editar
                  </Button>
                </form>
              </ModalRoot>
            </Modal>
    )
}