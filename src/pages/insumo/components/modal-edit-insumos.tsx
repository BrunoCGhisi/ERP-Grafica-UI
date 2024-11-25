import { Box, Grid, Select, MenuItem, Modal, Button, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import "../../venda.css";
import { putSupplie } from "../../../shared/services";
import { insumoSchemaType, insumoSchema } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalStyle } from "../../../shared/styles";
import { NumericFormat } from "react-number-format";

interface ModalEditInsumo {
    open: boolean
    toggleModal: () => void
    loadSupplies: () => void
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    insumos: insumoSchemaType[],
}

export function ModalEditInsumo({open, loadSupplies, toggleModal, setAlertMessage, setShowAlert, idToEdit, insumos, }: ModalEditInsumo){

    const filterInsumos= insumos.filter((insumo) => insumo.id === idToEdit);
    console.log("AAAAAAAAAA ",filterInsumos[0].valorM2)

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<insumoSchemaType>({
      resolver: zodResolver(insumoSchema),
      defaultValues: {
        nome: filterInsumos[0].nome,
        valorM2: filterInsumos[0].valorM2,
        estoque: filterInsumos[0].estoque,
        isActive: filterInsumos[0].isActive,
      },
    });

  async function handleUpdate(data: insumoSchemaType){
    try {
      const newData = {...data, id: idToEdit}
      const response = await putSupplie(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadSupplies();
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
                            label="Nome"
                            helperText={errors.nome?.message || "Obrigatório"}
                            error={!!errors.nome}
                            {...register("nome")}
                          />
                        </Grid>

                        <Grid item xs={12} md={100}>
                        <Controller
                          name="valorM2"
                          control={control}
                          defaultValue={filterInsumos[0]?.valorM2 || 1} // Valor padrão ou valor existente
                          rules={{ required: "Valor é obrigatório" }}
                          render={({ field: { value, onChange }, fieldState: { error } }) => (
                            <NumericFormat
                              customInput={TextField}
                              prefix="R$"
                              sx={{ width: 450 }}
                              id="outlined-helperText"
                              label="Valor Metro Quadrado"
                              thousandSeparator="."
                              decimalSeparator=","
                              allowLeadingZeros
                              value={value} // Vincula o valor inicial do formulário
                              onValueChange={(values) => {
                                const { floatValue } = values; // Extrai o valor numérico (sem formatação)
                                onChange(floatValue ?? 0); // Atualiza o estado do formulário
                              }}
                              helperText={error?.message || "Obrigatório"}
                              error={!!error}
                            />
                          )}
                        />


                        </Grid>
                        <Grid item xs={12} md={100}>
                          <TextField
                            sx={{width: 450}}
                            id="outlined-helperText"
                            label="Estoque"
                            type="number"
                            
                            helperText={
                              errors.estoque?.message || "Obrigatório"
                            }
                            error={!!errors.estoque}
                            {...register("estoque", { valueAsNumber: true })}
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