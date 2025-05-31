import { Link } from "react-router-dom";
import * as GameConstants from "../GameConstants";
import fireHydrantImg from '../assets/fire_hydrant.svg';

type NavbarProps = {
    setShowStartScreen?: (b: boolean)=>void;
}

export function Navbar(navbarProps: NavbarProps) {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center ">
                <div className="flex items-center">
                    <img src={fireHydrantImg} alt="Logo" className="mr-2" width={32} height={32} />
                    <h1 className="text-white text-2xl font-bold">{GameConstants.TEXT_TITLE}</h1>
                </div>
                <div className="text-white">
                    {navbarProps.setShowStartScreen ? 
                        <Link to="/" className="mr-4 hover:underline text-lg" onClick={()=>navbarProps.setShowStartScreen?.(true)}>Home</Link>
                        :
                        <Link to="/" className="mr-4 hover:underline text-lg">Home</Link>
                    }
                    <Link to="/impressum" className="mr-4 hover:underline text-lg" >Impressum</Link>
                </div>
            </div>
        </nav>
    );
}