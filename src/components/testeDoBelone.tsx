import { Box, Button, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import DoneIcon from "@mui/icons-material/Done";
import  ModalStyle  from "../pages/styles/ModalStyle";
import {useForm, Controller } from "react-hook-form";
import axios from "axios";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from "zod";

type DataRow = {
  id: number,
  idFornecedor: number,
  isCompraOS: boolean,
  dataCompra: string,
  numNota: number,
  desconto: number,
  isOpen: boolean,
}

const DataRowSchema = z.object({
  id: z.number().optional(),
  idFornecedor: z.coerce.number(),
  isCompraOS: z.boolean(),
  dataCompra: z.string(),
  numNota: z.coerce.number(),
  desconto: z.coerce.number(),
  isOpen: z.boolean(),
})

type DataRowType = z.infer<typeof DataRowSchema>


export function ModalDoBelone({data, open, toggleModal}: {data: DataRow, open: boolean, toggleModal: any}){
  
    async function handleUpdate(){
      try {
        const response = await axios.put(`http://localhost:3000/compra?id=${data.id}`, data);
        if (response.status === 200) alert("compras atualizado com sucesso")
      } catch (error: any) {
        console.error(error);
      }
    }
    const {register, handleSubmit, formState: {errors}, control} = useForm<DataRowType>({
      resolver: zodResolver(DataRowSchema)
    });

    return (
        <>
        <Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={ModalStyle}> //falta fazer
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Editar Banco
              </Typography>

              <form onSubmit={handleSubmit(handleUpdate)}> 
              <TextField
                id="outlined-idFornecedor"
                label="IDs Fornecedor"
                inputProps={{ readOnly: true }}
                helperText={errors.idFornecedor?.message || "Obrigatório"}
                defaultValue={data.idFornecedor}
                error={!!errors.idFornecedor?.message}
                {...register('idFornecedor')}
              />
              <InputLabel id="demo-simple-select-label">
                Compra ou OS
              </InputLabel>
              
               <Controller
                control={control}
                name="isCompraOS"
                defaultValue={true}
                render={({field}) => ( 
                <Select
                  onChange={field.onChange}
                  value={field.value}
                >
                  <MenuItem value={true}>Compra</MenuItem>
                  <MenuItem value={false}>OS</MenuItem>
                </Select>
                ) }
              /> 

              <TextField
                type="text"
                label={"Data compra"}
                InputLabelProps={{ shrink: true }}
                size="medium"
                defaultValue={dayjs(data.dataCompra).format("DD-MM-YYYY")}
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                {...register('dataCompra')}
              />

              <TextField
                id="outlined-numNota"
                label="Número da Nota"
                defaultValue={data.numNota}
                helperText={errors.numNota?.message || "Obrigatório"}
                error={!!errors.numNota}
                {...register('numNota')}
              />
              <TextField
                id="outlined-desconto"
                label="Desconto"
                defaultValue={data.desconto}
                helperText={errors.desconto?.message || "Obrigatório"}
                error={!!errors.desconto}
                {...register('desconto')}
              />

              <InputLabel id="demo-simple-select-label">
                Em aberto?
              </InputLabel>

              <Controller
                control={control}
                name="isOpen"
                defaultValue={true}
                render={({field}) => (
                <Select
                  onChange={field.onChange}
                  labelId="select-label"
                  id="demo-simple-select"
                  label="isOpen"
                  value={field.value}
                  >
                  <MenuItem value={true}>Open</MenuItem>
                  <MenuItem value={false}>Close</MenuItem>
                </Select>
                
              )}
              />

              <Button
                type="submit"
                variant="outlined"
                startIcon={<DoneIcon />}
              >
                Atualizar
              </Button>
              </form>
            </Box>
          </Modal>

        </>
    )
}