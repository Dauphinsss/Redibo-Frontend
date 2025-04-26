import { Footer } from "@/components/ui/footer";
import { Header } from "../registro/header";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso del servicio REDIBO",
};

export default function TerminosYCondicionesPage() {
  return (
    <>
      
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">
              1. ACEPTACIÓN DE TÉRMINOS
            </h2>
            <p>
              Al acceder y utilizar este servicio, usted acepta estar sujeto a
              estos términos y condiciones. Si no está de acuerdo con alguna
              parte de estos términos, no podrá acceder al servicio.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              2. USO DEL SERVICIO
            </h2>
            <p>
              Usted se compromete a utilizar el servicio de manera responsable y
              de acuerdo con todas las leyes aplicables. Está prohibido utilizar
              el servicio para cualquier propósito ilegal o no autorizado.
            </p>
            <p>
              Como usuario, usted es responsable de mantener la confidencialidad
              de su cuenta y contraseña, y de restringir el acceso a su
              computadora. Usted acepta la responsabilidad por todas las
              actividades que ocurran bajo su cuenta o contraseña.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. PRIVACIDAD</h2>
            <p>
              Recopilamos y procesamos su información personal de acuerdo con
              nuestra política de privacidad. Al utilizar nuestro servicio,
              usted consiente a la recopilación y uso de esta información según
              lo establecido en la política de privacidad.
            </p>
            <p>
              Nos comprometemos a proteger su información personal y solo la
              utilizaremos para los fines específicos para los que fue
              recopilada.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              4. PROPIEDAD INTELECTUAL
            </h2>
            <p>
              Todo el contenido proporcionado a través del servicio está
              protegido por derechos de autor y otras leyes de propiedad
              intelectual. El servicio y su contenido original, características
              y funcionalidad son propiedad de REDIBO y están protegidos por
              leyes internacionales de derechos de autor, marcas registradas,
              patentes, secretos comerciales y otras leyes de propiedad
              intelectual.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              5. LIMITACIÓN DE RESPONSABILIDAD
            </h2>
            <p>
              No seremos responsables por daños indirectos, incidentales o
              consecuentes que surjan del uso del servicio. En ningún caso
              seremos responsables por daños que excedan el monto pagado por
              usted, si corresponde, por el uso del servicio durante los últimos
              tres meses.
            </p>
            <p>
              No garantizamos que el servicio sea ininterrumpido, oportuno,
              seguro o libre de errores. No garantizamos que los resultados que
              se puedan obtener del uso del servicio sean precisos o confiables.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              6. MODIFICACIONES
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Las modificaciones entrarán en vigor inmediatamente
              después de su publicación en el servicio. Es su responsabilidad
              revisar estos términos periódicamente para estar al tanto de las
              modificaciones.
            </p>
            <p>
              Su uso continuado del servicio después de la publicación de las
              modificaciones constituirá su aceptación de los nuevos términos.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. TERMINACIÓN</h2>
            <p>
              Podemos terminar o suspender su acceso al servicio inmediatamente,
              sin previo aviso ni responsabilidad, por cualquier motivo,
              incluyendo, sin limitación, si usted incumple estos términos y
              condiciones.
            </p>
            <p>
              Todas las disposiciones de estos términos que por su naturaleza
              deberían sobrevivir a la terminación sobrevivirán a la
              terminación, incluyendo, sin limitación, las disposiciones de
              propiedad, renuncias de garantía, indemnización y limitaciones de
              responsabilidad.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              8. LEY APLICABLE
            </h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las leyes
              del país, sin tener en cuenta sus disposiciones sobre conflictos
              de leyes.
            </p>
            <p>
              Nuestra falta de hacer cumplir cualquier derecho o disposición de
              estos términos no se considerará una renuncia a esos derechos. Si
              alguna disposición de estos términos es considerada inválida o
              inaplicable por un tribunal, las disposiciones restantes de estos
              términos permanecerán en vigor.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. CONTACTO</h2>
            <p>
              Si tiene alguna pregunta sobre estos términos, por favor
              contáctenos a través de nuestro formulario de contacto o envíenos
              un correo electrónico a info@redibo.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
