import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home } from "../pages";
import { Login } from "../pages";
import { SignUp } from "../pages";
import { Banco } from "../pages";
import { Cliente } from "../pages";
import { Usuario } from "../pages";
import { CategoriaProduto } from "../pages";
import { FormaPgto } from "../pages";
import { Produto } from "../pages";
import { Compra } from "../pages";
import { Venda } from "../pages";
import { NoPage } from "../pages";
import { Testes  } from "../pages";

import { ProtectedRoute } from "../components";


const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route
        path="/banco"
        element={
          <ProtectedRoute>
            <Banco />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cliente"
        element={
          <ProtectedRoute>
            <Cliente />
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuario"
        element={
          <ProtectedRoute>
            <Usuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categoria_produto"
        element={
          <ProtectedRoute>
            <CategoriaProduto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forma_pgto"
        element={
          <ProtectedRoute>
            <FormaPgto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/produto"
        element={
          <ProtectedRoute>
            <Produto />
          </ProtectedRoute>
        }
      />
      <Route
        path="/compra"
        element={
          <ProtectedRoute>
            <Compra />
          </ProtectedRoute>
        }
      />
      <Route
        path="/venda"
        element={
          <ProtectedRoute>
            <Venda />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/teste" element={<Testes/>} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
