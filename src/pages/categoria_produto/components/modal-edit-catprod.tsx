import { Box, Grid, Select, MenuItem, Modal, Button, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import "../../venda.css";
import { putCategories } from "../../../shared/services";
import { insumoSchema, proCategorySchema, proCategorySchemaType } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalStyle } from "../../../shared/styles";

interface ModalEditCategoria {
    open: boolean
    toggleModal: () => void
    loadProductCategories: () => void
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    categorias: proCategorySchemaType[],
}

export function ModalEditCategoria({open, loadProductCategories, toggleModal, setAlertMessage, setShowAlert, idToEdit, categorias, }: ModalEditCategoria){
    console.log("BBBBBBBBBBBBB")
    const filterCategoria= categorias.filter((categoria) => categoria.id === idToEdit);
    

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<proCategorySchemaType>({
      resolver: zodResolver(proCategorySchema),
      defaultValues: {
        categoria: filterCategoria[0].categoria,
        isActive: filterCategoria[0].isActive,
      },
    });

  async function handleUpdate(data: proCategorySchemaType){
    console.log("AAAAAAAAAAAAAA")
    try {
      const newData = {...data, id: idToEdit}
      const response = await putCategories(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadProductCategories();
      reset();
      toggleModal();
    } catch (error) {
      console.error("Erro ao atualizar insumo:", error)
    }
  }     

    return (
        <Modal
              open={open}
              onClose={toggleModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={ModalStyle}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Editar Insumo
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <form onSubmit={handleSubmit(handleUpdate)}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={100}>
                          <TextField
                            sx={{width: 450}}
                            id="outlined-helperText"
                            label="Categoria"
                            helperText={errors.categoria?.message || "Obrigatório"}
                            error={!!errors.categoria}
                            {...register("categoria")}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Controller
                          
                            name="isActive"
                            control={control}
                            defaultValue={false}
                            render={({ field }) => (
                              <Select
                                sx={{width: 450}}
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
              </Box>
        </Modal>
    )
}