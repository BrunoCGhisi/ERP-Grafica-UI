import { Box, Grid, Select, MenuItem, Modal, Button, TextField, Typography, InputLabel, Switch } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import "../../venda.css";
import { putFinances, putSupplie } from "../../../shared/services";
import { insumoSchema, financeiroSchema, financeiroSchemaType, financiaSchemaType, financiaSchema } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalStyle } from "../../../shared/styles";
import { NumericFormat } from "react-number-format";

interface ModalEditFinanceiro {
    open: boolean
    toggleModal: () => void
    loadFinances: () => void
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    finances: financiaSchemaType[],
}

export function ModalEditFinanceiro({open, loadFinances, toggleModal, setAlertMessage, setShowAlert, idToEdit, finances, }: ModalEditFinanceiro){

    const filterFinances= finances.filter((fin) => fin.id === idToEdit);
    console.log("FINANCAS", filterFinances)
  

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<financiaSchemaType>({
      resolver: zodResolver(financiaSchema),
      defaultValues: {
        dataVencimento: filterFinances[0].dataVencimento,
        dataCompetencia: filterFinances[0].dataCompetencia,
        situacao: filterFinances[0].situacao,

      },
    });

    const situacao = watch("situacao");

    const handleSwitchChange = (event:  React.ChangeEvent<HTMLInputElement>) => {
        if( filterFinances[0].isPagarReceber === false){
            setValue("situacao", event.target.checked ? 3 : 1);
        }
        else{
            setValue("situacao", event.target.checked ? 4 : 2);
        }
    };

    async function handleUpdate(data: financiaSchemaType){
        try {
        const newData = {...data, id: idToEdit}
        const response = await putFinances(newData);
        if (response.data) {
            setAlertMessage(response.data);
            setShowAlert(true);
            setTimeout(() => {
            setShowAlert(false);
            }, 5000);
        }
        loadFinances();
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
                Cadastro Categoria de Produto
              </Typography>
            </Grid>
      
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleUpdate)}>
                
                <Grid item xs={10}>
                    <InputLabel>Data de Vencimento</InputLabel>
                    <TextField
                      fullWidth
                      type="date"
                      id="outlined-helperText"
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.dataVencimento?.message || "Obrigatório"
                      }
                      error={!!errors.dataVencimento}
                      {...register("dataVencimento")}
                    />
                </Grid>

                <Grid item xs={10}>
                    <InputLabel>Data de Competência</InputLabel>
                    <TextField
                      fullWidth
                      type="date"
                      id="outlined-helperText"
                      InputLabelProps={{ shrink: true }}
                      helperText={
                        errors.dataCompetencia?.message || "Obrigatório"
                      }
                      error={!!errors.dataCompetencia}
                      {...register("dataCompetencia")}
                    />
                </Grid>

                <Grid item xs={10}>
                  <InputLabel>Situação do Pagamento</InputLabel>
                  <Box display="flex" alignItems="center">

                    {filterFinances[0].isPagarReceber === false && (
                        <Switch
                            checked={situacao === 3} // Verifica se o valor é 1 (ativo)
                            onChange={handleSwitchChange}
                        />
                    )}
                    {filterFinances[0].isPagarReceber === true &&(
                        <Switch
                            checked={situacao === 4} // Verifica se o valor é 1 (ativo)
                            onChange={handleSwitchChange}
                        />
                    )}
                  </Box>
                </Grid>

                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button
                      type="submit"
                      variant="outlined"
                      startIcon={<DoneIcon />}
                    >
                      Cadastrar
                    </Button>
                  </Grid>
               
              </form>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    )
}