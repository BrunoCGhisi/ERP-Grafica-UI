import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useAppThemeContext } from "../shared/contexts";

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
  Insumo
} from "../pages";

import { ProtectedRoute } from "../shared/components";
import { AdmRoute } from "../shared/components";

const Router = () => {
  const { toggleTheme } = useAppThemeContext();

  return (
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

        <Route
          path="/insumo"
          element={
            <ProtectedRoute>
              <Insumo />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/teste" element={<Testes />} />
        <Route path="/t" element={<Template  toggleTheme={toggleTheme}/>} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
