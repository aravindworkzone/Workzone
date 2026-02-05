import {useCheckUserQuery} from '../redux/api/auth';
import LoginSkeleton from '../components/Loader/loginSkeleton';
import { useLocation } from "react-router-dom";

const AppGate = ({ children }) => {
    const loaction = useLocation();
    const { isLoading, isError } = useCheckUserQuery();
    const isPublic = ['/login', '/register'].includes(loaction.pathname);
    if(isPublic) return children;

    if(isLoading) return <LoginSkeleton />;

    if (isError) {
        window.location.href = "/login";
        return null;
    }
    return children;
}

export default AppGate;