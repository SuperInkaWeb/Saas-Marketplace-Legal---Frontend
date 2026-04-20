"use client";

import React from "react";
import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsOfServicePage() {
  return (
    <LegalLayout 
      title="Términos de Servicio" 
      lastUpdated="20 de Abril de 2026"
    >
      <section>
        <h2>1. Introducción y Aceptación</h2>
        <p>
          Bienvenido a <strong>AbogHub</strong> (en adelante, la "Plataforma"), operada bajo la marca <strong>QORIBEX</strong>. Al acceder o utilizar nuestro sitio web y servicios, usted acepta estar legalmente vinculado por estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar la Plataforma.
        </p>
      </section>

      <hr className="my-10" />

      <section>
        <h2>2. Naturaleza del Servicio</h2>
        <p>
          AbogHub funciona como un ecosistema digital de arquitectura legal soberana. Nuestra función principal es facilitar el encuentro entre profesionales del derecho (en adelante, "Arquitectos Legales") y personas naturales o jurídicas que requieran servicios legales (en adelante, "Clientes").
        </p>
        <p>
          <strong>Importante:</strong> La Plataforma no es una firma de abogados. La relación profesional y el mandato legal se establecen directamente entre el Arquitecto Legal y el Cliente.
        </p>
      </section>

      <section>
        <h2>3. Responsabilidades del Usuario</h2>
        <p>
          Al utilizar AbogHub, usted se compromete a:
        </p>
        <ul>
          <li>Proporcionar información veraz, exacta y actualizada durante el registro y la generación de documentos.</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
          <li>No utilizar la Plataforma para fines ilícitos o que contravengan la ética profesional.</li>
          <li>En el caso de los profesionales, garantizar que cuentan con las credenciales vigentes para el ejercicio del derecho en la jurisdicción correspondiente.</li>
        </ul>
      </section>

      <section>
        <h2>4. Generación de Documentos y Propiedad Intelectual</h2>
        <p>
          La Plataforma ofrece herramientas de autoría legal y generación dinámica de documentos. Todos los algoritmos, diseños de interfaz, y "plantillas inteligentes" son propiedad exclusiva de QORIBEX.
        </p>
        <p>
          El usuario retiene la propiedad de los datos ingresados, pero se le otorga una licencia de uso personal o comercial limitada sobre el documento final generado a través de nuestros sistemas. Queda prohibida la reventa de las plantillas base de la Plataforma.
        </p>
      </section>

      <section>
        <h2>5. Tarifas y Pagos</h2>
        <p>
          El uso de ciertas funciones de la Plataforma o la contratación de Arquitectos Legales puede estar sujeto a tarifas. Los pagos se procesan a través de pasarelas de pago seguras integradas. QORIBEX actúa como agente de cobro limitado para facilitar la transacción entre las partes según el modelo de marketplace.
        </p>
      </section>

      <section>
        <h2>6. Limitación de Responsabilidad</h2>
        <p>
          QORIBEX se esfuerza por mantener la precisión técnica del sistema, pero no garantiza que los documentos generados automáticamente sean adecuados para todas las situaciones jurídicas complejas sin la revisión de un profesional. No somos responsables por interpretaciones erróneas de los resultados por parte de los Clientes.
        </p>
      </section>

      <section>
        <h2>7. Jurisdicción y Resolución de Conflictos</h2>
        <p>
          Estos Términos de Servicio se rigen por las leyes de la <strong>República del Perú</strong>.
        </p>
        <p>
          Cualquier controversia derivada del uso de la Plataforma será sometida preferentemente a mediación. De no alcanzarse un acuerdo, las partes se someten a la competencia de los jueces y tribunales del Distrito Judicial de Lima, Perú, renunciando expresamente a cualquier otro fuero.
        </p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>
          Para cualquier duda o consulta técnica respecto a estos términos, puede dirigirse a nuestro canal de soporte oficial indicado en el portal o mediante correo electrónico institucional.
        </p>
      </section>
    </LegalLayout>
  );
}
