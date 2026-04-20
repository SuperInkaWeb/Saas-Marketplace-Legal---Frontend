"use client";

import React from "react";
import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout 
      title="Política de Privacidad" 
      lastUpdated="20 de Abril de 2026"
    >
      <section>
        <h2>1. Compromiso de Privacidad</h2>
        <p>
          En <strong>AbogHub</strong> (QORIBEX), valoramos la confianza que deposita en nosotros al compartir su información personal. De conformidad con la <strong>Ley N° 29733</strong>, Ley de Protección de Datos Personales de la República del Perú, y su Reglamento, nos comprometemos a garantizar la confidencialidad y seguridad de sus datos.
        </p>
      </section>

      <hr className="my-10" />

      <section>
        <h2>2. Información que Recopilamos</h2>
        <p>
          Para proporcionar nuestros servicios de arquitectura legal, recopilamos los siguientes tipos de datos:
        </p>
        <ul>
          <li><strong>Datos de Registro:</strong> Nombre, correo electrónico, documento de identidad (DNI/RUC) y teléfono.</li>
          <li><strong>Datos Profesionales:</strong> En el caso de abogados, número de colegiatura y especialidad.</li>
          <li><strong>Datos de Navegación:</strong> Dirección IP, cookies y datos de uso de la plataforma.</li>
          <li><strong>Información de Pago:</strong> Procesada de forma segura mediante terceros certificados.</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del Tratamiento</h2>
        <p>
          Sus datos personales son utilizados para las siguientes finalidades necesarias:
        </p>
        <ul>
          <li>Gestionar su cuenta y el acceso a las herramientas de la Plataforma.</li>
          <li>Facilitar la conexión entre Clientes y Arquitectos Legales.</li>
          <li>Generar documentos legales dinámicos basados en sus entradas.</li>
          <li>Procesar transacciones por servicios contratados.</li>
          <li>Enviar notificaciones críticas sobre el servicio o cambios en nuestros términos.</li>
        </ul>
      </section>

      <section>
        <h2>4. Consentimiento</h2>
        <p>
          Al registrarse y marcar la casilla de aceptación, usted otorga su consentimiento previo, informado, expreso e inequívoco para que AbogHub trate sus datos personales según lo descrito en esta política. Usted tiene el derecho de revocar este consentimiento en cualquier momento.
        </p>
      </section>

      <section>
        <h2>5. Derechos ARCO</h2>
        <p>
          Como titular de datos personales, usted puede ejercer sus derechos de <strong>Acceso, Rectificación, Cancelación y Oposición (ARCO)</strong> enviando una solicitud formal a nuestra administración.
        </p>
        <p>
          Atenderemos su solicitud dentro de los plazos establecidos por la normativa peruana vigente.
        </p>
      </section>

      <section>
        <h2>6. Seguridad de la Información</h2>
        <p>
          Implementamos medidas técnicas y organizativas para proteger sus datos contra acceso no autorizado, pérdida o alteración. Utilizamos protocolos de cifrado y firewalls de última generación para asegurar que su arquitectura legal permanezca privada.
        </p>
      </section>

      <section>
        <h2>7. Transferencia de Datos</h2>
        <p>
          No vendemos sus datos a terceros. Sus datos solo pueden ser compartidos con proveedores de servicios (como pasarelas de pago o servidores de hosting) que actúan como encargados de tratamiento y cumplen con estándares de seguridad internacionales.
        </p>
      </section>

      <section>
        <h2>8. Contacto</h2>
        <p>
          Si tiene consultas sobre el tratamiento de sus datos personales bajo la ley peruana, puede contactarnos a través de los canales oficiales de soporte de la Plataforma.
        </p>
      </section>
    </LegalLayout>
  );
}
