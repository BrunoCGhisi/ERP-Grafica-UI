import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  Home,
  Template,
  Login,
  SignUp,
  Banco,
  Cliente,
  Usuario,
  CategoriaProduto,
  FormaPgto,
  Produto,
  Compra,
  Venda,
  NoPage,
  Testes,
} from "../pages";

import { ProtectedRoute } from "../shared/components";
import { AdmRoute } from "../shared/components";
import { ThemeProvider } from "@emotion/react";
import { LightTheme } from "../shared/themes";

const Router = () => (
  <ThemeProvider theme={LightTheme}>
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
        <Route path="/teste" element={<Testes />} />
        <Route path="/t" element={<Template />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);

export default Router;
