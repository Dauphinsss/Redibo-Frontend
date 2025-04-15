import { FaUserFriends, FaGasPump, FaStar } from "react-icons/fa";
import { MdPlace } from "react-icons/md";
import { GiCarDoor, GiGearStick } from "react-icons/gi";

export default function InfoPrincipal(){
    return (
        <div className="space-y-2">

            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                    <FaUserFriends className="text-gray-600" />5
                </span>
                <span className="flex items-center gap-1">
                    <GiCarDoor className="text-gray-600" />5
                </span>
                <span className="flex items-center gap-1">
                    <GiGearStick className="text-gray-600" />Manual
                </span>
                <span className="flex items-center gap-1">
                    <FaGasPump className="text-gray-600" />Gasolina
                </span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-700">
                <FaStar className="text-black" />
                <span>4.5 - 1000 evaluaciones</span>
            </div>
            
            <div className="flex items-center gap-1 text-gray-700">
                <MdPlace className="text-gray-600" />
                <span>
                    Quillacollo, Cochabamba
                    <br />
                </span>
            </div>
        </div>
    )
}