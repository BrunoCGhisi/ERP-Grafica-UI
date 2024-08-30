import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from '../pages'
import { Login } from '../pages'
import { Banco } from '../pages'
import { Cliente } from '../pages'
import { Usuario } from '../pages'
import { CategoriaProduto } from '../pages'
import { FormaPgto } from '../pages'

import { NoPage } from '../pages'



const Router = () => (
    //constante Router é igual a uma função vazia que vai executar a pesquisa rotas e paginas
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/home"   element={<Home />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/banco" element={<Banco />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/categoriaProduto" element={<CategoriaProduto />} />
        <Route path="/forma_pgto" element={<FormaPgto />} />
        <Route path="*"       element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
  
  export default Router;