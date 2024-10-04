import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@mui/material";

// Definindo o esquema de validação usando Zod
const testeSchema = z.object({
    nome: z.string(), // Validação para string não vazia
    valorTotal: z.number() // Validação para número
});

// Inferindo o tipo a partir do esquema do Zod
type testeSchemaType = z.infer<typeof testeSchema>;

const Testes = () =>  {

    // Inicializando o useForm com o zodResolver e o tipo inferido
    const { register, handleSubmit} = useForm<testeSchemaType>({
        resolver: zodResolver(testeSchema),
    });
    
    function handleTeste(data: testeSchemaType) {
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(handleTeste)}>
            {/* Campo Nome com validação */}
            <TextField
                id="outlined-helperText"
                label="Nome"
                helperText={"Obrigatório"} // Exibe erro se houver
                // Marca o campo como inválido se houver erro
                {...register('nome')}
            />
            {/* Campo valorTotal com validação */}
            <TextField
                id="outlined-helperText"
                label="Valor Total"
                type="number"
                helperText={"Obrigatório"} // Exibe erro se houver
                 // Marca o campo como inválido se houver erro
                {...register('valorTotal', { valueAsNumber: true })} // Converte valor para número
            />

            <Button
                type="submit" 
                variant="outlined">
                Cadastrar
            </Button>
        </form>
    );
}

export default Testes;

//----------------------------------------------------------------------------------------------------- */}

type dataRow = {
    id: number,
    idFornecedor: number,
    isCompraOS: boolean,
    dataCompra: string,
    numNota: number,
    desconto: number,
    isOpen: boolean,
  }

const [selectedData, setSelectedData] = useState<dataRow | null>(null);

const handleEdit = (updateData: dataRow) => {
    setSelectedData(updateData)
    toggleModal()
    console.log('updateData', updateData)
    console.log('selectedData', selectedData)
  } 


<Modal
            open={open}
            onClose={toggleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
          <ModalRoot children={
            
            <form onSubmit={handleSubmit(putPurchases)}>
              <TextField
                id="outlined-idFornecedor"
                label="IDs Fornecedor"
                inputProps={{ readOnly: true }}
                helperText={errors.idFornecedor?.message || "Obrigatório"}
                error={!!errors.idFornecedor?.message}
                {...register("idFornecedor")}
              />

              <TextField
                type="date"
                label={"Data compra"}
                InputLabelProps={{ shrink: true }}
                size="medium"
                defaultValue={dayjs('dataCompra').format("DD-MM-YYYY")}
                helperText={errors.dataCompra?.message || "Obrigatório"}
                error={!!errors.dataCompra}
                {...register("dataCompra")}
              />
              <Button type="submit" variant="outlined" startIcon={<DoneIcon />}>
                Atualizar
              </Button>
            </form>
          }/> 
</Modal>    
