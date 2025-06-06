"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Loader2, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { API_URL } from "@/utils/bakend";
import Header from "@/components/ui/Header";
import { Footer } from "@/components/ui/footer";

interface Conductor {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  foto?: string;
  // Agrega otros campos si son parte de los datos de conductor
}

export default function MisConductores() {
  const [loading, setLoading] = useState(true);
  const [conductores, setConductores] = useState<Conductor[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Conductor | null>(
    null
  );

  useEffect(() => {
    // Validar rol
    const rolesStr = localStorage.getItem("roles") || "";
    let roles: string[] = [];
    if (rolesStr.includes("[")) {
      try {
        roles = JSON.parse(rolesStr);
      } catch {
        roles = rolesStr.split(",").map((r) => r.trim());
      }
    } else {
      roles = rolesStr.split(",").map((r) => r.trim());
    }
    if (!roles.includes("RENTER")) {
      setError(
        "Acceso denegado. Solo los usuarios con rol RENTER pueden ver esta sección."
      );
      setLoading(false);
      return;
    }
    // Fetch conductores asociados
    const fetchConductores = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("auth_token");
        const res = await axios.get(`${API_URL}/api/partners-drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ordenar conductores alfabéticamente por nombre
        const sortedConductores = res.data.partners
          ? [...res.data.partners].sort((a: Conductor, b: Conductor) =>
              a.nombre.localeCompare(b.nombre)
            )
          : [];
        setConductores(sortedConductores);
      } catch (err) {
        console.log(err);
        setError("Error al cargar conductores asociados.");
      } finally {
        setLoading(false);
      }
    };
    fetchConductores();
  }, []);

  return (
    <div className=" min-h-screen flex flex-col">
      <Header />
      <Button
        variant="secondary"
        className="mt-2 ml-2 md:mt-4 md:ml-4 hover:scale-105 max-w-24"
        onClick={() => router.back()}
      >
        <ChevronLeft /> Volver
      </Button>
      <div className="w-4xl mx-auto p-4 text-center md:text-left max-w-[98vw]">
        <h1 className="text-2xl font-bold mb-2">Mis Conductores</h1>
        <p className="mb-6 text-gray-600">
          Gestiona y revisa la información de tus conductores asociados
        </p>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : conductores.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Aún no tienes conductores asociados. <br />{" "}
            <span className="text-sm">
              Puedes asociarte a uno desde la sección Socios en la pagina
              principal.
            </span>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {conductores.map((c) => (
              <li
                key={c.id}
                className="flex items-center bg-white rounded-lg border-1 shadow p-4 gap-4"
              >
                {c.foto &&
                typeof c.foto === "string" &&
                /^https?:\/\//.test(c.foto) ? (
                  <img
                    src={c.foto}
                    alt={c.nombre}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <Image
                    src={c.foto || "/file.svg"}
                    alt={c.nombre}
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{c.nombre}</div>
                  <div className="text-gray-500 text-sm truncate">
                    {c.telefono}
                  </div>
                  <div className="text-gray-500 text-sm truncate">
                    {c.correo}
                  </div>
                </div>
                <Button
                  variant="default"
                  className="min-w-[110px]"
                  onClick={() => {
                    setSelectedPartner(c);
                    setIsContactModalOpen(true);
                  }}
                >
                  Contactar
                </Button>
              </li>
            ))}
          </ul>
        )}

        {/* Contact Modal */}
        <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Contactar Conductor</DialogTitle>
              <DialogDescription>
                Información de contacto de {selectedPartner?.nombre}
              </DialogDescription>
            </DialogHeader>
            {selectedPartner && (
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {selectedPartner.foto &&
                    typeof selectedPartner.foto === "string" &&
                    /^https?:\/\//.test(selectedPartner.foto) ? (
                      <img
                        src={selectedPartner.foto}
                        alt={selectedPartner.nombre}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <Image
                        src={selectedPartner.foto || "/file.svg"}
                        alt={selectedPartner.nombre}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedPartner.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">Conductor</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{selectedPartner.telefono}</p>
                  </div>
                  <a
                    href={`https://wa.me/${selectedPartner.telefono?.replace(
                      /[^0-9]/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contactar por WhatsApp"
                  >
                    <Button variant="outline" size="icon">
                      <FaWhatsapp className="h-5 w-5" />
                    </Button>
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedPartner.correo}</p>
                  </div>
                  <a
                    href={`mailto:${selectedPartner.correo}`}
                    aria-label="Enviar correo electrónico"
                  >
                    <Button variant="outline" size="icon">
                      <Mail className="h-5 w-5" />
                    </Button>
                  </a>
                </div>
                {/* Botón Enviar Mensaje - puede ser implementado después si es necesario */}
                {/* <Button className="w-full mt-4">Enviar Mensaje</Button> */}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
