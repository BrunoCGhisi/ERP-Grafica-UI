import { Box, InputLabel, Select, MenuItem, Modal, Button, TextField, Typography, IconButton, Grid, InputAdornment } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import dayjs from "dayjs";
import "../../venda.css";
import { getSupplies, putSale} from "../../../shared/services";
import { vendaSchema, vendaSchemaType,vendaProdutoSchemaType, financeiroSchemaType, insumoSchemaType, bancoSchemaType } from "../../../shared/services/types";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  produtoSchemaType,
} from "../../../shared/services/types";
import { ModalRootFull } from "../../../shared/components/ModalRootFull";
import DeleteIcon from "@mui/icons-material/Delete";
import { NumericFormat } from "react-number-format";



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
    produtosAll: produtoSchemaType[]
    vendasProdutos: vendaProdutoSchemaType[]
    bancos : bancoSchemaType[]
    bancosAll : bancoSchemaType[]
    userId: number | null
    idToEdit: any
    vendas: vendaSchemaType[],
    financeiro: financeiroSchemaType[]
}

export function ModalEditVenda({open, loadSales, toggleModal, clientes, setAlertMessage, setShowAlert, produtos, idToEdit, userId, bancos, vendas, vendasProdutos, financeiro, bancosAll, produtosAll}: ModalEditVenda){
  
    
    const filterVendas = vendas.filter((venda) => venda.id === idToEdit);
    const idVendas = filterVendas.map((venda) => venda.id);
 
    const cliente = clientes.filter((cliente) => cliente.id === filterVendas[0]?.idCliente);
    const vendedor = vendas.find((venda) => venda.idVendedor === filterVendas[0]?.idVendedor);
    
    
    const venda_produto = vendasProdutos.filter((vp) => idVendas.includes(vp.idVenda));
    const financeiros = financeiro.filter((fin) => idVendas.includes(fin.idVenda));

    const [totalQuantidade, setTotalQuantidade] = useState(0);

    const bancosAssociado = financeiros[0].idBanco ? bancosAll.find((banco) => banco.id === financeiros[0].idBanco) : null
    const bancosAtivos = bancos.filter((banco) => banco.isActive);
    const bancosSelect = bancosAssociado && !bancosAssociado.isActive ? [...bancosAtivos, bancosAssociado ] : bancosAtivos

    const produtoAssociado = venda_produto[0]?.idProduto
    ? produtosAll.find((produto) => produto.id === venda_produto[0]?.idProduto) : null;
    const produtosAtivos = produtos.filter((produto) => produto.isActive);
    const produtosParaSelect = produtoAssociado && !produtoAssociado.isActive
      ? [...produtosAtivos, produtoAssociado]  
      : produtosAtivos;

    const { register, handleSubmit, reset, control, watch, setValue, formState: { errors } } = useForm<vendaSchemaType>({
      resolver: zodResolver(vendaSchema),
      defaultValues: {
        idCliente: cliente[0].id,
        desconto: filterVendas[0].desconto,
        situacao: filterVendas[0].situacao,
        isVendaOS: filterVendas[0].isVendaOS,
        dataAtual: dayjs(filterVendas[0].dataAtual).format("YYYY-MM-DD"),
        financeiro: financeiros.map(fin => ({ idBanco: fin.idBanco, idFormaPgto: fin.idFormaPgto, parcelas: fin.parcelas, valor: fin.valor })),
        idVendedor: vendedor?.idVendedor,
        vendas_produtos: venda_produto.map(vp => ({ idProduto: vp?.idProduto, quantidade: vp?.quantidade }))
      },
    });

  useEffect(() => {
    const PriceSugestion = async () => {
      try {
        const response = await getSupplies();
        const subscription = watch((values) => {
          const sum = values.vendas_produtos?.reduce((acc, item) => {
            const produto = produtos.find(
              (produto: produtoSchemaType) => produto.id === item?.idProduto
            ); if (!produto) return acc;
  
            const insumos = response.filter(
              (insumo: insumoSchemaType) => insumo.id === produto.idInsumo
            );
            console.log(produto.comprimento)
            const insumoVal = insumos.reduce(
              (accInsumo: number, insumo: insumoSchemaType) => {
                const area = produto.comprimento && produto.largura
                  ? ((produto.comprimento / 100) * (produto.largura / 100))
                  : 0;

                const valorM2 = insumo.valorM2 || 0;
                return accInsumo + (valorM2 * area);
              },
              0
            );
            return acc +( insumoVal * (Number(item?.quantidade))  + 23|| 0);
          }, 0);
          setTotalQuantidade(sum || 0);
        });
        return () => subscription.unsubscribe();
      } catch (error) {
        console.error("Erro ao buscar insumos ou calcular valores:", error);
      }
    };
  
    PriceSugestion();
  }, [watch, getSupplies]);
            
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
    if ( waiter === 1 || waiter === 4 || waiter === 2) {
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
      <ModalRootFull>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Editar Venda
        </Typography>

        <form onSubmit={handleSubmit(handleUpdate)}>

          <Grid container spacing={2}>
            <Grid item xs={8}>
              {/* Primeira coluna */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputLabel>Vendedor</InputLabel>
                  <TextField
                    fullWidth
                    id="outlined-helperText"
                    inputProps={{ readOnly: true }}
                    error={!!errors.idVendedor}
                    defaultValue={userId}
                    {...register("idVendedor")}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Cliente </InputLabel>
                  <Select
                    fullWidth
                    {...register("idCliente")}
                    labelId="select-label"
                    id="demo-simple-select"
                    label="idCliente"
                    error={!!errors.idCliente}
                    defaultValue={cliente[0]?.id || ""}
                  >
                    {clientes &&
                      clientes.map((cliente) => (
                        <MenuItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                
                <Grid item xs={3}>
                  <InputLabel>Data da Venda</InputLabel>
                  <TextField
                    type="date"
                    id="outlined-helperText"
                    label={"Data compra"}
                    InputLabelProps={{ shrink: true }}
                    helperText={errors.dataAtual?.message || "Obrigatório"}
                    error={!!errors.dataAtual}
                    {...register("dataAtual")}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={3}>
                  <InputLabel>Tipo</InputLabel>
                  <Controller
                    control={control}
                    name="isVendaOS"
                    defaultValue={1}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        onChange={field.onChange}
                        value={field.value}
                      >
                        <MenuItem value={0}>Venda</MenuItem>
                        <MenuItem value={1}>Orçamento</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <InputLabel>Situação</InputLabel>
                  <Controller
                    control={control}
                    name="situacao"
                    defaultValue={0}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        onChange={field.onChange}
                        value={field.value}
                      >
                        <MenuItem value={0}>Em espera</MenuItem>
                        <MenuItem value={1}>Em criação (arte)</MenuItem>
                        <MenuItem value={2}>Em execução</MenuItem>
                        <MenuItem value={3}>Em acabamento</MenuItem>
                        <MenuItem value={4}>Finalizado</MenuItem>
                        <MenuItem value={5}>Entregue</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    id="outlined-helperText"
                    label="Desconto"
                    defaultValue={0}
                    sx={{ mt: 3 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          %
                        </InputAdornment>
                      ),
                    }}
                    helperText={
                      errors.desconto?.message || "Obrigatório"
                    }
                    error={!!errors.desconto}
                    {...register("desconto", { valueAsNumber: true })}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <InputLabel id="demo-simple-select-label">
                    Banco
                  </InputLabel>
                  <Controller
                    name={`financeiro.0.idBanco`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        {...field}
                        value={field.value || ""} // Valor padrão do idBanco
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {bancosSelect?.map((banco) => (
                          <MenuItem key={banco.id} value={banco.id}>
                            {banco.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputLabel>Forma de Pagamento</InputLabel>
                  <Controller
                    name={`financeiro.0.idFormaPgto`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        {...field}
                        value={field.value || ""} // Valor padrão do idForma_pgto
                        onChange={(e) => field.onChange(e.target.value)}
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
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ marginTop: 1 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Parcelas"
                    type="number"
                    defaultValue={1}
                    InputProps={{
                      readOnly:
                        waiter === 2 || waiter === 1 || waiter === 4,
                    }}
                    {...register("financeiro.0.parcelas")}
                  />
                </Grid>

                <Grid item xs={6}>
                <Controller
                  name={"financeiro.0.valor"}
                  control={control}
                    
                  rules={{ required: "Valor é obrigatório" }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <NumericFormat
                      customInput={TextField}
                      prefix="R$"
                      fullWidth
                      id="outlined-helperText"
                      label="Preço por m²"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowLeadingZeros
                      placeholder={`Valor bruto: ${totalQuantidade}`}
                      value={value} // Valor atual
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        onChange(floatValue ?? 0); // Atualiza o valor no react-hook-form
                      }}
                      error={!!error}
                    />
                  )}
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Segunda coluna */}
            <Grid item xs={4}>
              <Grid item xs={12}>
                {fields.map((item, index) => (
                  <Box
                    key={item.id}
                    display="flex"
                    flexDirection="column" // Alterado para 'column' para separar o Select da quantidade + delete
                    gap={2}
                  >
                    <Grid container spacing={2}>
                      {/* Select ocupando a linha inteira */}
                      <Grid item xs={12}>
                        <InputLabel id={`produto-label-${index}`}>
                          Produto
                        </InputLabel>
                        <Controller
                          control={control}
                          name={
                            `vendas_produtos.${index}.idProduto` as const
                          }
                          defaultValue={0}
                          render={({ field }) => (
                            <Select
                              fullWidth
                              {...field}
                              error={
                                !!errors.vendas_produtos?.[index]
                                  ?.idProduto
                              }
                            >
                              {produtosParaSelect.map((produto) => (
                                <MenuItem
                                  key={produto.id}
                                  value={produto.id}
                                >
                                  {produto.nome}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        />
                      </Grid>
                    </Grid>

                    {/* Quantidade e Ícone de Delete lado a lado */}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={10}>
                        <TextField
                          {...register(
                            `vendas_produtos.${index}.quantidade` as const
                          )}
                          type="number"
                          error={
                            !!errors.vendas_produtos?.[index]
                              ?.quantidade
                          }
                          label="Quantidade"
                          fullWidth
                          defaultValue={1}
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ mb: 1 }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          onClick={() => handleRemoveProduct(index)}
                          color="primary"
                          sx={{ mt: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: "right", mt: 2 }}>
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
                sx={{ ml: 2 }}
              >
                Editar
              </Button>
            </Grid>
          </Grid>
        </form>
      </ModalRootFull>
    </Modal>
    )
}