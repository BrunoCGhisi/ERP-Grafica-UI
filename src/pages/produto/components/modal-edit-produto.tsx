import {
  InputLabel,
  Grid,
  Select,
  MenuItem,
  Modal,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { putProducts } from "../../../shared/services";
import {
  insumoSchemaType,
  produtoSchema,
  proCategorySchemaType,
} from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { produtoSchemaType } from "../../../shared/services/types";
import { NumericFormat } from "react-number-format";

interface ModalEditProduto {
  open: boolean;
  toggleModal: () => void;
  loadProducts: () => void;
  insumos: insumoSchemaType[];
  insumosAll: insumoSchemaType[];
  categoriasProdutos: proCategorySchemaType[];
  setAlertMessage: (alertMessage: string) => void;
  setShowAlert: (open: boolean) => void;
  idToEdit: any;
  produtos: produtoSchemaType[];
}

export function ModalEditProduto({
  open,
  loadProducts,
  toggleModal,
  categoriasProdutos,
  setAlertMessage,
  setShowAlert,
  produtos,
  idToEdit,
  insumos, insumosAll
}: ModalEditProduto) {
  //const today = new Date()
  const filterProdutos = produtos.filter((produto) => produto.id === idToEdit);

  const insumo = insumosAll.filter(
    (insumo) => insumo.id === filterProdutos[0]?.idInsumo
  );
  const categoria = categoriasProdutos.filter(
    (categoria) => categoria.id === filterProdutos[0]?.idCategoria
  );

  const insumosAtivos = insumos; // Lista de insumos ativos
  const insumoAssociado = insumosAll.find(
    (insumo) => insumo.id === filterProdutos[0]?.idInsumo
  );
  
  // Crie a lista de insumos para o select, incluindo o insumo associado, se ele não estiver ativo
  const insumosParaSelect = insumoAssociado
    ? [...insumosAtivos, insumoAssociado].filter(
        (value, index, self) => self.findIndex((i) => i.id === value.id) === index
      )
    : insumosAtivos;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<produtoSchemaType>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      nome: filterProdutos[0].nome,
      tipo: filterProdutos[0].tipo,
      keyWord: filterProdutos[0].keyWord,
      idCategoria: categoria[0].id,
      idInsumo: insumo[0].id,
      largura: filterProdutos[0].largura,
      comprimento: filterProdutos[0].comprimento,
      isActive: filterProdutos[0].isActive,
    },
  });

  async function handleUpdate(data: produtoSchemaType) {
    try {
      const newData = { ...data, id: idToEdit };
      const response = await putProducts(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadProducts();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  }
  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalRoot>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Editar Produto
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={handleSubmit(handleUpdate)}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-helperText"
                    label="Nome"
                    helperText={errors.nome?.message || "Obrigatório"}
                    error={!!errors.nome}
                    fullWidth
                    {...register("nome")}
                  />

                  <InputLabel id="insumo-label">Insumos</InputLabel>
                  <Controller
                    name="idInsumo"
                    
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        labelId="select-label"
                        id="demo-simple-select"
                        sx={{mb: 3}}
                        
                        error={!!errors.idInsumo}
                        {...field}
                      >
                        {insumosParaSelect &&
                          insumosParaSelect.map((insumo) => (
                            <MenuItem key={insumo.id} value={insumo.id}>
                              {insumo.nome}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />

                  <InputLabel id="categoria-label">Categorias</InputLabel>
                  <Controller
                    name="idCategoria"
                    control={control}
                    render={({ field }) => (
                      <Select
                        fullWidth
                        labelId="select-label"
                        id="demo-simple-select"
                        error={!!errors.idCategoria}
                        {...field}
                      >
                        {categoriasProdutos &&
                          categoriasProdutos.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                              {categoria.categoria}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  />

                  <InputLabel id="tipo-label" sx={{mt:3}}>Tipo</InputLabel>
                  <Controller
                    control={control}
                    name="tipo"
                    defaultValue={true}
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="tipo-label"
                        id="tipo-select"
                        fullWidth
                        
                      >
                        <MenuItem value={true}>Não</MenuItem>
                        <MenuItem value={false}>Sim</MenuItem>
                      </Select>
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                    {/* Campo KeyWord */}
                    <TextField
                      id="outlined-helperText"
                      label="Descrição"
                      helperText={
                        errors.keyWord?.message 
                      }
                      error={!!errors.keyWord}
                      fullWidth
                      {...register("keyWord")}
                      sx={{mb:3}}
                    />
                  

                    <TextField
                    sx={{ marginTop: 2.9, mb: 3   }}
                    id="outlined-helperText"
                    label="Largura"
                    helperText={errors.largura?.message || "Obrigatório"}
                    error={!!errors.largura}
                    fullWidth
                    {...register("largura")}
                   />

                    <TextField
                      id="outlined-helperText"
                      label="Comprimento"
                      helperText={
                        errors.comprimento?.message || "Obrigatório"
                      }
                      error={!!errors.comprimento}
                      fullWidth
                      {...register("comprimento")}
                    />
                   <InputLabel id="tipo-label">Status</InputLabel>
                          <Controller
                            name="isActive"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Select
                                label="Status"
                                fullWidth
                                onChange={field.onChange}
                                value={field.value}
                              >
                                <MenuItem value={true}>Ativo</MenuItem>
                                <MenuItem value={false}>Desativado</MenuItem>
                              </Select>
                            )}
                          />
                  </Grid>

                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button
                      type="submit"
                      variant="outlined"
                      startIcon={<DoneIcon />}
                    >
                      Editar
                    </Button>
                  </Grid>
                </Grid>
                            
            </form>
          </Grid>
        </Grid>
      </ModalRoot>
    </Modal>
  );
}
