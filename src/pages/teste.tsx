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

