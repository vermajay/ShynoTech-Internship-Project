import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import OpenRoute from "./components/Auth/OpenRoute"
import PrivateRoute from "./components/Auth/PrivateRoute"
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import ImagePosts from "./pages/ImagePosts";

function App() {
  return (
    <Routes>
      <Route path="/" element={   <OpenRoute> <AuthPage/> </OpenRoute>   }/>
      <Route path="login" element={   <OpenRoute> <LogIn/> </OpenRoute>   }/>
      <Route path="signup" element={   <OpenRoute> <SignUp/> </OpenRoute>   }/>
      <Route path="image-posts" element={   <PrivateRoute> <ImagePosts/> </PrivateRoute>   }/>
    </Routes>
  );
}

export default App;