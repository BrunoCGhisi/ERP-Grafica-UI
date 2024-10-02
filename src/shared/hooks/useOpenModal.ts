import { useState } from "react";


export function useOpenModal(){
const [open, setOpen] = useState(false)

function toggleModal(): void {
    setOpen(!open)
}
return {
    open, 
    toggleModal
}
}