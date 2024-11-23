import { Grid, Modal, Button, TextField, Typography, Select, MenuItem } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import "../../venda.css";
import { putBank } from "../../../shared/services";
import { bancoSchemaType, bancoSchema } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { ModalRoot } from "../../../shared/components/ModalRoot";

interface ModalEditBanco {
    open: boolean
    toggleModal: () => void
    loadBanks: () => void
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    bancos: bancoSchemaType[],
}

export function ModalEditBanco({open, loadBanks, toggleModal, setAlertMessage, setShowAlert, idToEdit, bancos, }: ModalEditBanco){

    const filterBancos= bancos.filter((banco) => banco.id === idToEdit);

    const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<bancoSchemaType>({
      resolver: zodResolver(bancoSchema),
      defaultValues: {
        nome: filterBancos[0].nome,
        valorTotal:  filterBancos[0].valorTotal
      },
    });

  async function handleUpdate(data: bancoSchemaType){
    try {
      const newData = {...data, id: idToEdit}
      const response = await putBank(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadBanks();
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
        <ModalRoot>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                gutterBottom
              >
                Editar Banco
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      id="outlined-helperText"
                      label="Nome da Instituição Bancária"
                      helperText={errors.nome?.message || "Obrigatório"}
                      error={!!errors.nome}
                      {...register("nome")}
                    />
                  </Grid>

                  <Grid item xs={12} md={8}>
                    <NumericFormat
                      customInput={TextField}
                      prefix="R$"
                      fullWidth
                      id="outlined-helperText"
                      label="Saldo"
                      thousandSeparator=","
                      decimalSeparator="."
                      allowLeadingZeros
                      value={watch("valorTotal")} // Obtém o valor atual do formulário
                      onValueChange={(values) => {
                        const { floatValue } = values;
                        setValue("valorTotal", floatValue ?? 0); // Atualiza o valor no formulário
                      }}
                      helperText={
                        errors.valorTotal?.message || "Obrigatório"
                      }
                      error={!!errors.valorTotal}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Controller
                        name="isActive"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <Select
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
    )
}