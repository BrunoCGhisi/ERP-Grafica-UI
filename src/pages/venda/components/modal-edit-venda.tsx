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
import { putSale } from "../../../shared/services";
import { VendaDataRow, vendaSchema, vendaSchemaType } from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

interface ModalEditVenda {
    open: boolean
    toggleModal: () => void
    clientes: {
        nome: string;
        id?: number | undefined;
    }[]
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    produtos: {
        nome: string
        tipo: boolean
        keyWord: string
        idCategoria: number
        idInsumo: number
        preco: number
        tamanho: number
        id?: number | undefined
    }[]
    setFormaPagamento: (value: React.SetStateAction<number>) => void
    formaPagamento: number
    handleAddProduct: () => void
    handleRemoveProduct: (index: number) => void
    bancos : {
        nome: string;
        valorTotal: number;
        id?: number | undefined;
    }[]
    userId: number | null
    idToEdit: any
}

export function ModalEditVenda({open, toggleModal, clientes, setAlertMessage, setShowAlert, produtos, setFormaPagamento, idToEdit, formaPagamento, userId, bancos, handleRemoveProduct , handleAddProduct, vendas}: ModalEditVenda){
    const today = new Date()
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
        } = useForm<vendaSchemaType>({
        resolver: zodResolver(vendaSchema),
        defaultValues: {
            vendas_produtos: [{ idProduto: 0, quantidade: 1 }], // Inicializa com um produto
        },
        });

    const { fields } = useFieldArray({
        control,
        name: "vendas_produtos",
        });

    const filterVendas = vendas.filter((venda: number) => venda.id === idToEdit);
    console.log()


    async function handleUpdate(data: vendaSchemaType){
        const newData = {...data, id: idToEdit}
        
        const response = await putSale(newData);
            if (response.data) {
            setAlertMessage(response.data);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            reset()
            }
            toggleModal();
        }

    
    
    return (
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <ModalRoot title="Editar venda">
                <form onSubmit={handleSubmit(handleUpdate)}>
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
                  <Select
                    {...register("idCliente")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="idCliente"
                    error={!!errors.idCliente}
                    defaultValue={
                      clientes.length > 0 ? clientes[0].nome : "Sem clientes"
                    }
                  >
                    {clientes &&
                      clientes.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </MenuItem>
                      ))}
                  </Select>

                  <TextField
                    type="date"
                    id="outlined-helperText"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.dataAtual?.message || "Obrigatório"}
                    error={!!errors.dataAtual}
                    defaultValue={dayjs(today).format("YYYY-MM-DD")}
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
                    defaultValue={true}
                    render={({ field }) => (
                      <Select onChange={field.onChange} value={field.value}>
                        <MenuItem value={true}>Compra</MenuItem>
                        <MenuItem value={false}>OS</MenuItem>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="situacao"
                    defaultValue={0}
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

                  <Select
                    {...register("idBanco")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="Banco"
                    error={!!errors.idBanco}
                    defaultValue={bancos.length > 0 ? bancos[0] : "Sem bancos"}
                  >
                    {bancos &&
                      bancos.map((banco) => (
                        <MenuItem key={banco.id} value={banco.id}>
                          {banco.nome}
                        </MenuItem>
                      ))}
                  </Select>

                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name="idForma_pgto"
                    control={control}
                    defaultValue={1}
                    render={({ field }) => (
                      <Select
                        {...field}
                        value={formaPagamento}
                        onChange={(e) => {
                          setFormaPagamento(e.target.value);
                          field.onChange(e);
                        }}
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
                    defaultValue={1}
                    InputProps={{
                      readOnly: formaPagamento === 0 || formaPagamento === 1,
                    }}
                    {...register("parcelas")}
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