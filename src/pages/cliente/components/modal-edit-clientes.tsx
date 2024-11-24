import { InputLabel, Select, MenuItem, Modal, Button, TextField } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import { Controller, useForm } from "react-hook-form";
import { ModalRoot } from "../../../shared/components/ModalRoot";
import "../../venda.css";
import { clienteSchema, clienteSchemaType } from "../../../shared/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { putClients } from "../../../shared/services/clienteService";
import { PatternFormat } from "react-number-format";

interface ModalEditCompra {
    open: boolean
    toggleModal: () => void
    loadClients: () => void
    idToEdit: number
    setAlertMessage: (alertMessage: string) => void
    setShowAlert: (open: boolean) => void
    clientes: clienteSchemaType[],
}

export function ModalEditCliente({clientes, open, toggleModal, loadClients, idToEdit, setAlertMessage, setShowAlert}: ModalEditCompra){

    const filterClientes = clientes.filter((cliente) => cliente.id === idToEdit);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<clienteSchemaType>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
          nome: filterClientes[0].nome,
          nomeFantasia: filterClientes[0].nomeFantasia,
          cpfCnpj: filterClientes[0].cpfCnpj,
          telefone: filterClientes[0].telefone,
          email: filterClientes[0].email,
          isFornecedor: filterClientes[0].isFornecedor,
          cep: filterClientes[0].cep,
          estado: filterClientes[0].estado,
          cidade: filterClientes[0].cidade,
          numero: filterClientes[0].numero,
          endereco: filterClientes[0].endereco,
          complemento: filterClientes[0].complemento,
          numIe: filterClientes[0].numIe,
          statusIe: filterClientes[0].statusIe,
        },
      });

    async function handleUpdate(data: clienteSchemaType){
      try {
          const newData = {...data, id: idToEdit}
          const response = await putClients(newData);
          if (response.data) {
              setAlertMessage(response.data);
              setShowAlert(true);
              setTimeout(() => {
                setShowAlert(false);
              }, 5000);
            }

            loadClients();
            reset();
            toggleModal();
      } catch (error) {
          console.error("Erro ao atualizar clientes:", error)
      }
    };


    return(
        <Modal
        open={open}
        onClose={toggleModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">

        <ModalRoot> 
        <form onSubmit={handleSubmit(handleUpdate)}>
          <TextField
            {...register("nome")}
            id="outlined-helperText"
            label="Nome"
            defaultValue=""
            helperText={errors.nome?.message || "Obrigatório"}
            error={!!errors.nome}
            
          />

          <TextField
            id="outlined-helperText"
            label="Nome Fantasia"
            defaultValue=""
            helperText={errors.nomeFantasia?.message || "Obrigatório"}
            error={!!errors.nomeFantasia}
            {...register("nomeFantasia")}
          />

          <TextField
            id="outlined-helperText"
            label="CPF/CNPJ"
            defaultValue=""
            helperText={errors.cpfCnpj?.message || "Obrigatório"}
            error={!!errors.cpfCnpj}
            {...register("cpfCnpj")}
          />
            
            <Controller
              name="telefone"
              control={control}
              render={({ field }) => (
                <PatternFormat
                  {...field}
                  format="(##) #####-####" // Formato de telefone
                  mask="_"
                  customInput={TextField} // Utiliza TextField como input
                  label="Telefone"
                  error={!!errors.telefone}
                  helperText={errors.telefone ? errors.telefone.message : "Obrigatório"}
                  fullWidth
                />
              )}
            />
          

          <TextField
            id="outlined-helperText"
            label="E-Mail"
            defaultValue=""
            helperText={errors.email?.message || "Obrigatório"}
            error={!!errors.email}
            {...register("email")}
          />
          <InputLabel id="demo-simple-select-label">StatusIe</InputLabel>

          <Controller
          control={control}
          name="isFornecedor"
          defaultValue={true}
          render={({field}) => (
          <Select
            onChange={field.onChange}
            labelId="select-label"
            id="demo-simple-select"
            label="Perfil de Cadastro"
            error={!!errors.isFornecedor}
            value={field.value}
          >
            <MenuItem value={false}>Cliente</MenuItem>
            <MenuItem value={true}>Fornecedor </MenuItem>
          </Select>
          )}/>

          <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <PatternFormat
                  {...field}
                  format="####-####" // Formato de telefone
                  mask="_"
                  customInput={TextField} // Utiliza TextField como input
                  label="CEP"
                  error={!!errors.cep}
                  helperText={errors.cep ? errors.cep.message : "Obrigatório"}
                  fullWidth
                />
              )}
            />
          
          <TextField
            id="outlined-helperText"
            label="Estado"
            defaultValue=""
            helperText={errors.estado?.message || "Obrigatório"}
            error={!!errors.estado}
            {...register("estado")}
          />
          <TextField
            id="outlined-helperText"
            label="Cidade"
            defaultValue=""
            helperText={errors.cidade?.message || "Obrigatório"}
            error={!!errors.cidade}
            {...register("cidade")}
          />
          <TextField
            id="outlined-helperText"
            label="Número"
            defaultValue=""
            helperText={errors.numero?.message || "Obrigatório"}
            error={!!errors.numero}
            {...register("numero")}
          />
          <TextField
            id="outlined-helperText"
            label="Endereço"
            defaultValue=""
            helperText={errors.endereco?.message || "Obrigatório"}
            error={!!errors.endereco}
            {...register("endereco")}
          />
          <TextField
            id="outlined-helperText"
            label="Complemento"
            defaultValue=""
            helperText={errors.complemento?.message || "Obrigatório"}
            error={!!errors.complemento}
            {...register("complemento")}
          />

          <TextField
            id="outlined-helperText"
            label="Numéro da Inscrição Estadual"
            defaultValue=""
            helperText={errors.numIe?.message || "Obrigatório"}
            error={!!errors.numIe}
            {...register("numIe")}
          />
          <InputLabel id="demo-simple-select-label">Inscrição Estadual</InputLabel>

          <Controller
          control={control}
          name="statusIe"
          defaultValue={true}
          render={({field}) => (
          <Select
            onChange={field.onChange}
            labelId="select-label"
            id="demo-simple-select"
            label="Status da Inscrição Estadual"
            value={field.value} 
          >
            <MenuItem value={true}>Não contribuinte</MenuItem>
            <MenuItem value={false}>Contribuinte</MenuItem>
          </Select>
        )}/>
        
          <Button
            type="submit"
            variant="outlined"
            startIcon={<DoneIcon />}
          >
            Alterar
          </Button>
        </form>
        </ModalRoot>
      </Modal>
    )
}



































