'use server';
import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { env } from '@/env';

export type TokenComfenalco = {
  exito: boolean;
  mensaje: string;
  data: {
    usuarioId: string;
    nombres: string;
    roles: [
      {
        rolId: string;
        nombreRol: string;
      },
    ];
    token: string;
    refreshToken: string;
    tiempoExpiracion: number;
  };
};

export type UploadFileComfenalco = {
  exito: boolean;
  mensaje: string;
  data: [
    {
      nombreArchivo: string;
      llaveArchivo: string;
      estadoSubida: string;
    },
  ];
};

export type DownloadFileComfenalco = {
  exito: boolean;
  mensaje: string;
  data: string;
};

export type DeleteFileComfenalco = {
  exito: boolean;
  mensaje: string;
  data: {
    archivosEliminados: string;
    erroresEliminando: string;
  };
};

export type ValidarDocMenorEdadData = {
  documento: string;
  primerNombre: string;
  primerApellido: string;
  fechaNacimiento: string;
};

export type ValidarDocMenorEdadResponse =
  | {
      exito: true;
      mensaje: string;
      data: {
        documento: string;
        estado: boolean;
        validacion?: string[];
      }[];
    }
  | {
      exito: false;
      mensaje: string;
      data: { errores: string[] };
    };

export const getToken = async () => {
  try {
    const body = {
      appLlave: env.COMFENALCO_APP_LLAVE,
      appToken: env.COMFENALCO_APP_APPTOKEN,
      identificador: env.COMFENALCO_APP_IDENTIFICADOR,
      clave: env.COMFENALCO_APP_CLAVE,
    };

    const response = await fetch(`${env.COMFENALCO_URL}/seguridad/auth`, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    const res = (await response.json()) as TokenComfenalco;
    return res;
  } catch (e) {
    throw new Error('No se pudo acceder a Comfenalco');
  }
};

export const sendEmail = async ({
  from,
  subject,
  body,
}: {
  from: string;
  subject: string;
  body: string;
}) => {
  const data = {
    para: from,
    asunto: subject,
    mensaje: body,
  };

  const response = await fetch(`${env.COMFENALCO_URL}/mensajeria/enviar/email`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  const res = await response.json();
  return res;
};

export const sendSMS = async (mobile: string, msg: string) => {
  const data = {
    numeroCelular: mobile,
    mensaje: msg,
  };

  const response = await fetch(`${env.COMFENALCO_URL}/mensajeria/enviar/sms`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  const res = await response.json();
  return res;
};

export const saveFile = async ({ path, file }: { path: string; file: File }) => {
  const token = await getToken();
  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  const data = {
    tipoAcceso: 2,
    nombreBucket: env.COMFENALCO_BUCKET,
    cargarArchivos: {
      Archivo1: {
        contentType: file.type,
        rutaArchivo: `/${env.NODE_ENV}/${path}`,
        streamBase64: base64,
      },
    },
  };

  const response = await fetch(`${env.COMFENALCO_URL}/archivos/cargar`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token.data.token}`,
      'Content-Type': 'application/json',
    },
  });
  const res = response.status === 200 ? ((await response.json()) as UploadFileComfenalco) : false;
  return res;
};

export const deleteFile = async (filesId: string[]) => {
  const token = await getToken();
  const data = {
    nombreBucket: env.COMFENALCO_BUCKET,
    eliminarArchivosList: filesId,
  };

  const response = await fetch(`${env.COMFENALCO_URL}/archivos/eliminar`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token.data.token}`,
      'Content-Type': 'application/json',
    },
  });
  const res = response.status === 200 ? ((await response.json()) as DeleteFileComfenalco) : false;
  return res;
};

export const getFile = async (fileId: string) => {
  const token = await getToken();
  const data = {
    nombreBucket: env.COMFENALCO_BUCKET,
    keyArchivoBucket: fileId,
    expiracionHoras: 1,
  };

  const response = await fetch(`${env.COMFENALCO_URL}/archivos/acceso-temporal`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token.data.token}`,
      'Content-Type': 'application/json',
    },
  });
  const res = response.status === 200 ? ((await response.json()) as DownloadFileComfenalco) : false;
  return res;
};

export const getDefaultEmailTemplate = async ({
  title,
  content,
}: {
  title: string;
  content: string[];
}) => {
  const logo = `${env.NEXT_PUBLIC_API_URL}/images/company-logo.png`;
  const filePath = path.resolve(process.cwd(), 'src', 'email-templates', 'default-template.hbs');
  const source = fs.readFileSync(filePath, 'utf8');

  const template = handlebars.compile(source);
  const data = { logo, title, content };
  const emailHtml = template(data);

  return emailHtml;
};

export const validarDocMenorEdad = async (data: ValidarDocMenorEdadData) => {
  const token = await getToken();
  const response = await fetch(`${env.COMFENALCO_URL}/api/beneficiarios/ValidarDocMenorEdad`, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Authorization: `Bearer ${token.data.token}`,
      'Content-Type': 'application/json',
    },
  });
  const res =
    response.status === 200 ? ((await response.json()) as ValidarDocMenorEdadResponse) : false;
  return res;
};
