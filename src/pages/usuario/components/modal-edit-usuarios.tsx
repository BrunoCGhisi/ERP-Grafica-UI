import { Grid, Select, MenuItem, Modal, Button, TextField, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import "../../venda.css";
import { putUser } from "../../../shared/services";
import { usuarioSchemaType, usuarioSchema } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalRoot } from "../../../shared/components/ModalRoot";

interface ModalEditUsuario {
    open: boolean
    toggleModal: () => void
    loadUsers: () => void
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    idToEdit: any
    usuarios: usuarioSchemaType[],
}

export function ModalEditUsuario({open, loadUsers, toggleModal, setAlertMessage, setShowAlert, idToEdit, usuarios, }: ModalEditUsuario){

    const filterUsers= usuarios.filter((usuario) => usuario.id === idToEdit);
    console.log("filter", filterUsers )
    console.log(filterUsers[0].isAdm)

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<usuarioSchemaType>({
      resolver: zodResolver(usuarioSchema),
      defaultValues: {
        nome: filterUsers[0].nome,
        isAdm: filterUsers[0].isAdm,
      },
    });

  async function handleUpdate(data: usuarioSchemaType){
    try {
      const newData = {...data, id: idToEdit}
      const response = await putUser(newData);
      if (response.data) {
        setAlertMessage(response.data);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
      loadUsers();
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
                Editar Usuário
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <form onSubmit={handleSubmit(handleUpdate)}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-helperText"
                      label="Nome"
                      helperText={errors.nome?.message || "Obrigatório"}
                      error={!!errors.nome}
                      {...register("nome")}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Controller
                      control={control}
                      name="isAdm"
                      defaultValue={false} // valor booleano padrão
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          displayEmpty
                          inputProps={{
                            "aria-label": "Adm ou Funcionário",
                          }}
                        >
                          <MenuItem value={true}>Administrador</MenuItem>
                          <MenuItem value={false}>Funcionário</MenuItem>
                        </Select>
                      )}
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
                      Atualizar
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