import type {
  NewChild,
  NewCity,
  NewGuardian,
  NewInventory,
  NewInventoryTransaction,
  NewInventoryTransactionLine,
  NewModality,
  NewPlan,
  NewPlanModality,
  NewPlanModalityActivity,
  NewPlanModalityActivityResource,
  NewPlanModalityActivitySchool,
  NewPlanModalityActivitySchoolChild,
  NewPlanModalityActivitySchoolResource,
  NewPlanModalityActivitySchoolProfessional,
  NewPlanModalityActivitySchoolProof,
  NewPlanModalityActivitySchoolProofChildAttendance,
  NewPlanModalityActivitySchoolProofFile,
  NewResource,
  NewResourceClassification,
  NewResourceToSupplier,
  NewProfessional,
  NewProgram,
  NewProofFileClassification,
  NewSchool,
  NewSupplier,
} from '../schema';

import { env } from '@/env';
import { faker } from '@faker-js/faker';
import { conn, db } from '../db';
import {
  beneficiaryTypes,
  children,
  cities,
  countries,
  educationLevels,
  ethnicities,
  genders,
  guardians,
  identifications,
  indigenousCommunities,
  indigenousReserves,
  inventories,
  inventoryTransactionLines,
  inventoryTransactions,
  kinships,
  modalities,
  modalityTypes,
  planModalities,
  planModalityActivities,
  planModalityActivityResources,
  planModalityActivitySchoolChildren,
  planModalityActivitySchoolResources,
  planModalityActivitySchoolProfessionals,
  planModalityActivitySchoolProofChildrenAttendances,
  planModalityActivitySchoolProofFiles,
  planModalityActivitySchoolProofs,
  planModalityActivitySchools,
  plans,
  populations,
  resourceClassifications,
  resources,
  resourcesToSuppliers,
  professionals,
  programs,
  proofFileClassifications,
  schoolGrades,
  schools,
  servicesAipi,
  shifts,
  states,
  suppliers,
  vulnerabilityFactors,
} from '../schema';

async function seedModalityTypes() {
  await db.delete(modalityTypes);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'Ciencia y Tecnología' },
    { code: '2', name: 'Bilingüismo' },
    { code: '3', name: 'Lectura, escritura y oralidad' },
    { code: '4', name: 'Educación Ambiental' },
    { code: '5', name: 'Recreación y formación deportiva' },
    { code: '6', name: 'Formación artística y cultural' },
    { code: '8', name: 'Emprendimiento' },
  ];
  return db.insert(modalityTypes).values(values);
}

async function seedKinships() {
  await db.delete(kinships);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'Hijos' },
    { code: '2', name: 'Padres' },
    { code: '3', name: 'Hermano' },
    { code: '4', name: 'Hijastro' },
    { code: '5', name: 'Cónyuge o compañero (a) permanente' },
    { code: '6', name: 'Dependientes por custodia legal o judicial' },
    { code: '7', name: 'Abuelo/a' },
    { code: '8', name: 'Nieto/a' },
    { code: '9', name: 'Tío/a' },
    { code: '10', name: 'Sobrino/a' },
    { code: '11', name: 'Bisabuelo/a' },
    { code: '12', name: 'Bisnieto/a' },
    { code: '13', name: 'Suegro/a' },
    { code: '14', name: 'Cuñado/a' },
    { code: '15', name: 'Nuera' },
    { code: '16', name: 'Yerno' },
    { code: '17', name: 'Padres Adoptivos' },
    { code: '18', name: 'Hijos adoptivos' },
    { code: '19', name: 'Titular' },
    { code: '20', name: 'Empleada o niñera' },
    { code: '21', name: 'Amigo (a)' },
    { code: '22', name: 'Madre Comunitaria' },
    { code: '23', name: 'Madrina / Padrino' },
    { code: '24', name: 'Primo (a)' },
  ];
  return db.insert(kinships).values(values);
}

async function seedServicesAipi() {
  await db.delete(servicesAipi);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'Institucional - Centro Desarrollo Infantil' },
    { code: '2', name: 'Institucional - Hogares Infantiles' },
    { code: '3', name: 'Institucional - Hogares lactantes' },
    { code: '4', name: 'Institucional - HCB Múltiples' },
    { code: '5', name: 'Institucional - HCB Empresariales' },
    { code: '6', name: 'Institucional - Jardines Sociales' },
    { code: '7', name: 'Institucional - Preescolares' },
    {
      code: '8',
      name: 'Institucional - Niños y niñas hasta los 3 años hijos de mujeres privada de la libertad',
    },
    { code: '9', name: 'Familiar - Desarrollo Infantil en medio familiar' },
    { code: '10', name: 'Familiar - Familia, mujer e infancia - FAMI' },
    { code: '11', name: 'Comunitaria - HCB Familiares' },
    { code: '12', name: 'Comunitaria - HCB Agrupado' },
    { code: '13', name: 'Comunitaria - HCB Integrales' },
    { code: '14', name: 'Comunitaria - HCB Instruccional Integral' },
    { code: '16', name: 'Propia ICBF - Comunidades étnicas' },
    { code: '17', name: 'Propia ICBF - Comunidades rurales' },
    { code: '18', name: 'Propia CCF- Salud' },
    { code: '19', name: 'Propia CCF - Educación Inicial Jardines Infantiles' },
    { code: '20', name: 'Propia CCF - Educación Inicial Preescolares' },
    { code: '21', name: 'Propia CCF - Educación Inicial Empresariales)' },
    { code: '22', name: '22 Propia CCF - Cultura' },
    { code: '23', name: 'Propia CCF - Recreación y Deportes' },
    { code: '24', name: 'Propia CCF - Étnica' },
    { code: '25', name: 'Propia CCF - Comunidades rurales' },
  ];
  return db.insert(servicesAipi).values(values);
}

async function seedBeneficiaryTypes() {
  await db.delete(beneficiaryTypes);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'NINO' },
    { code: '2', name: 'NINA' },
    { code: '3', name: 'MUJER GESTANTE' },
    { code: '4', name: 'MADRE LACTANTE' },
    { code: '5', name: 'ADOLESCENTE' },
  ];
  return db.insert(beneficiaryTypes).values(values);
}

async function seedEducationLevels() {
  await db.delete(educationLevels);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'PREESCOLAR' },
    { code: '2', name: 'BASICA' },
    { code: '3', name: 'SECUNDARIA' },
    { code: '4', name: 'MEDIA' },
    { code: '5', name: 'N/A' },
    { code: '6', name: 'BASICA ADULTOS' },
    { code: '7', name: 'SECUNDARIA ADULTOS' },
    { code: '8', name: 'MEDIA ADULTOS' },
    { code: '9', name: 'PRIMERA INFANCIA' },
    { code: '10', name: 'TECNICO/TECNOLOGO' },
    { code: '11', name: 'PROFESIONAL UNIVERSITARIO' },
    { code: '12', name: 'POSGRADO/MAESTRIA' },
    { code: '13', name: 'NINGUNO' },
    { code: '14', name: 'INFORMACION NO DISPONIBLE' },
  ];
  return db.insert(educationLevels).values(values);
}

async function seedEthnicities() {
  await db.delete(ethnicities);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'AFROCOLOMBIANO' },
    { code: '2', name: 'COMUNIDAD NEGRA' },
    { code: '3', name: 'INDIGENA' },
    { code: '4', name: 'PALANQUERO' },
    { code: '5', name: 'RAIZAL DEL ARCHIPIELAGO DE SAN ANDRES, PROVIDENCIA Y SANTA CATALINA' },
    { code: '6', name: 'ROOM/GITANO' },
    { code: '7', name: 'NO SE AUTORECONOCE EN NINGUNO DE LOS ANTERIORES' },
    { code: '8', name: 'NO DISPONIBLE' },
  ];
  return db.insert(ethnicities).values(values);
}

async function seedGenders() {
  await db.delete(genders);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'HOMBRE' },
    { code: '2', name: 'MUJER' },
    { code: '3', name: 'NO APLICA' },
    { code: '4', name: 'INDETERMINADO' },
  ];
  return db.insert(genders).values(values);
}

async function seedIndigenousCommunities() {
  await db.delete(indigenousCommunities);
  const values = [
    { id: 0, code: '0', name: 'OTRO' },
    { code: '005', name: 'ARZARIO' },
    { code: '009', name: 'BARASANA' },
    { code: '015', name: 'CARABAYO' },
    { code: '017', name: 'CARAPANA, DESANO, KUBEO, TUCANO' },
    { code: '020', name: 'COCAMA, YAGUA' },
    { code: '022', name: 'COCONUCO, YANACONA' },
    { code: '025', name: 'COYAIMA Y OTROS' },
    { code: '026', name: 'COYAIMA-NATAGAIMA' },
    { code: '030', name: 'EMBERA CHAMI' },
    { code: '032', name: 'EMBERA KATIO' },
    { code: '034', name: 'EPERARA SAPIDARA' },
    { code: '044', name: 'KUBEO' },
    { code: '045', name: 'KUBEO,DESANO,TUYUKA,SIRIANO,WANANO,PIRATAPUYO,TARIANO' },
    { code: '046', name: 'KUIBA' },
    { code: '048', name: 'KURRIPAKO Y OTROS' },
    { code: '049', name: 'KURRIPAKO, OTRAS' },
    { code: '050', name: 'KURRIPAKO, PUINABE' },
    { code: '051', name: 'KURRIPAKO,WANANO,PUINABE,KUBEO,DESANO,TUCANO,PIRATAPUYO' },
    { code: '061', name: 'NASA - GUAMBIANO' },
    { code: '063', name: 'NONUYA, MUINANE Y OTROS' },
    { code: '068', name: 'PIAPOCO, SALIVA' },
    { code: '069', name: 'PIAPOCO,SIKUANI' },
    { code: '074', name: 'PUINABE, KURRIPAKO, NUKAK' },
    { code: '075', name: 'PUINABE, PIAPOCO' },
    { code: '076', name: 'PUINABE, SIKUANI' },
    { code: '077', name: 'PUINABE,KURRIPAKO' },
    { code: '078', name: 'PUINABE,KURRIPAKO,NUKAK,KUBEO' },
    { code: '079', name: 'PUINABE,PIAPOCO' },
    { code: '080', name: 'PUINABE,PIAPOCO,KURRIPAKO' },
    { code: '081', name: 'PUINABE,TUCANO,KURRIPAKO,KUBEO' },
    { code: '083', name: 'SENÃš' },
    { code: '085', name: 'SIKUANI, PIAPOCO' },
    { code: '086', name: 'SIKUANI,PUINABE' },
    { code: '087', name: 'SIKUANI,SIRIANO,OTROS' },
    { code: '089', name: 'SIONA, OTRAS' },
    { code: '096', name: 'TIKUNA,COCAMA' },
    { code: '1', name: 'NO TIENE' },
    { code: '10', name: 'ACHAGUA (AJAGUA, AXAGUA, XAGUA)' },
    { code: '100', name: 'BORA (MEAMUYNA, VORA)' },
    { code: '101', name: 'TUCANO,DESANO' },
    { code: '105', name: 'UITOTO' },
    { code: '106', name: 'UITOTO - TIKUNA' },
    { code: '107', name: 'UWA' },
    { code: '109', name: 'WANANO,CARAPANA,KUBEO,PIRATAPUYO' },
    { code: '110', name: 'KAWIYAR (CABIYAR, CAUIYARY, KABOYARI, KAWIARI)' },
    { code: '115', name: 'YANACONA, MIRANA, TANIMUCA, OTROS' },
    { code: '120', name: 'YURI (CARABAYO)' },
    { code: '130', name: 'CARAPANA (KARAPANA, MI TEA, MOXDOA, MUXTEA)' },
    { code: '140', name: 'KARIJONA (CARIJONA, CARIFUNA, HIANACOTO UMAUA, KALIOHONA)' },
    { code: '150', name: 'CHIMILA (CHIMISA, , ETTE ENEKA, SHIMISA,SIMSA)' },
    { code: '160', name: 'CHIRICOA (CHIRIKOA)' },
    { code: '170', name: 'COCAMA (COKAMA, KOKAMA)' },
    { code: '180', name: 'COCONUCO (KOKONUKO)' },
    { code: '190', name: 'COREGUAJE (COREBAHU, COREBAJU, KOREGUAXE)' },
    { code: '20', name: 'AMORÃƒÅ¡A (AMURUA, CHIRIPO)' },
    { code: '200', name: 'PIJAO (COYAIMA NATAGAIMA, COYAIMA, NATAGAIMA)' },
    { code: '21', name: 'WIPIWI' },
    { code: '210', name: 'AW (AWA KUAIKER, KUAIKER)' },
    { code: '220', name: 'CUBEO (COBEWA, HIPNWA, KANIWA, PANIWA)' },
    { code: '230', name: 'CUIVA (MAIBEN, UAMONE, WAMONE,CUIBA,KUIBA,KUIVA))' },
    { code: '240', name: 'CUNA TULE (GUNA DULE, CUNA, CUNAUSAYA)' },
    { code: '25', name: 'YAMALERO' },
    { code: '250', name: 'CURRIPACO (KURRIPAKO)' },
    { code: '251', name: 'BANIVA' },
    { code: '252', name: 'GUARIQUEMA' },
    { code: '26', name: 'YARURO' },
    { code: '260', name: 'DESANO (KOTEDIA, UINA, WINA, UIRA, WIRA)' },
    { code: '270', name: 'DUJOS (TAMAS, DUJOS DEL CAGUAN)' },
    { code: '280', name: 'EMBER' },
    { code: '281', name: 'EMBER KATO (CATO, EMBERÃ ZENÃš)' },
    { code: '282', name: 'EMBER CHAM (CHAM)' },
    { code: '283', name: 'EPERARA SIAPIDARA (EPERA, EEPERA PEDEE, EMBERA EPERA, SIAPIDARA)' },
    { code: '284', name: 'EMBER DOBIDA' },
    { code: '290', name: 'MISAK (NAM MISAK, MISAG,GUAMBIANO, HUAMIMEHAB, SILVIANO)' },
    { code: '291', name: 'AMBALÃ“' },
    { code: '292', name: 'KIZGÃ“ (QUIZGO)' },
    { code: '30', name: 'ANDOKE (ANDOQUE, BUSINCA, CHAOJE)' },
    { code: '300', name: 'GUANACA, GUANACO' },
    { code: '310', name: 'WANANO (GUANANO, KOTORIA)' },
    { code: '320', name: 'GUAYABERO (JIW, CUNIMIA, MITUA)' },
    { code: '330', name: 'CANAMOMO LOMAPRIETA (KUMBA)' },
    { code: '340', name: 'INGA (IMGA, INGANOS)' },
    { code: '350', name: 'KAMÃ‹NTSA (CAMÃ‹NTSA, KAMSA, CACHE, SIBUNDOY CACHE, SIBUNDOY)' },
    { code: '360', name: 'KOFN (COFAN)' },
    { code: '370', name: 'KOGUI (COGHI, KAGABA, KOGGIAN)' },
    { code: '380', name: 'LETUAMA (DETUAMO, LITUAMO)' },
    { code: '390', name: 'MUPUNKU (MUPUNKU, MUNKU, MUIPUNKU)' },
    { code: '40', name: 'KUVYA (KUVIA)' },
    { code: '400', name: 'MADRIGAL (FROANABA) ' },
    { code: '410', name: 'MOGOTÃ‰' },
    { code: '420', name: 'MUYUNA' },
    { code: '430', name: 'NASO' },
    { code: '440', name: 'NUEVO' },
    { code: '450', name: 'PAPAQUIRÁ' },
    { code: '460', name: 'PASTO (INDÍGENAS DEL PASTO)' },
    { code: '470', name: 'PIRATAPUYO' },
    { code: '480', name: 'POTRERO GRANDE' },
    { code: '490', name: 'QUIRÃ­' },
    { code: '500', name: 'RESGUARDO' },
    { code: '510', name: 'SADUÍO' },
    { code: '520', name: 'SANANDITA' },
    { code: '530', name: 'SANHUESO' },
    { code: '540', name: 'SANTA ANA' },
    { code: '550', name: 'SANTANDER' },
    { code: '560', name: 'SANTIAGO DEL RÍO' },
    { code: '570', name: 'SAYUCA' },
    { code: '580', name: 'SEYECOPA' },
    { code: '590', name: 'SERRANÍA DEL PERÚ' },
    { code: '600', name: 'SUMA' },
    { code: '610', name: 'SURIMBO' },
    { code: '620', name: 'TACHIRA' },
    { code: '630', name: 'TARIANO' },
    { code: '640', name: 'TURBO' },
    { code: '650', name: 'VALLEDUPAR' },
    { code: '660', name: 'VIRGINIA' },
    { code: '670', name: 'ZENU' },
    { code: '680', name: 'ZONA DE LA HUELGA' },
    { code: '690', name: 'ZONAL' },
    { code: '700', name: 'ZUMBO' },
    { code: '710', name: 'WOUNAN (NOANAMA, WAUNAN, WAUNANA, WAUNMEU)' },
    { code: '720', name: 'WAYUU (GUAJIRO, GUJIRO, UAIRA)' },
    { code: '730', name: 'MURUÍ (UITOTO, MINIKA, WITOTO)' },
    { code: '731', name: 'MUINANE' },
    { code: '732', name: 'YARÍ' },
    { code: '740', name: 'YAGUA (MISHARA, NIHAMWO, NUJAMUO)' },
    { code: '750', name: 'YANACONA (MITIMAE)' },
    { code: '760', name: 'YAUNA (CAMEJEYA, KAMEJEYA)' },
    { code: '770', name: 'YUKUNA (MAPAPI, YUCUNA MAPAPI)' },
    { code: '780', name: 'YUKPA (YUKO, YUCO)' },
    { code: '790', name: 'YURUTÍ (TAPUYA, TOTSOCA, WAI JIARA MASA, WAIKANA)' },
    { code: '80', name: 'BARI (BARIRA, CUNAUSAYA, DOBOCUBI, MOTILON)' },
    { code: '800', name: 'ZENÚ (SENÚ)' },
    { code: '810', name: 'GUANE' },
    { code: '820', name: 'MOKANA' },
    { code: '830', name: 'OTAVALENO (OTAVALENA)' },
    { code: '840', name: 'KICHWA' },
    { code: '850', name: 'KAMKUAMO (KANKUAMO)' },
    { code: '860', name: 'CHITARERO' },
    { code: '880', name: 'ANDAKIES' },
    { code: '90', name: 'BETOYE (JIRARE, JIRARRE, VETOYE)' },
    { code: '900', name: 'INDÍGENAS ECUADOR (DIFERENTE DE OTAVALENOS)' },
    { code: '9001', name: 'KARIJONA (CARIJONA) PUEBLO EN AISLAMIENTO VOLUNTARIO' },
    { code: '9002', name: 'MURUÍ (PUEBLOS INDÍGENAS EN AISLAMIENTO VOLUNTARIO)' },
    { code: '9003', name: 'UITOTOS (HUITOTO, WITOTO)' },
    { code: '9004', name: 'MAPAYERRY' },
    { code: '910', name: 'INDÍGENAS PERU' },
    { code: '9100', name: 'TUCANO Y OTRAS' },
    { code: '9110', name: 'WAUNAN' },
    { code: '920', name: 'INDÍGENAS VENEZUELA' },
    { code: '930', name: 'INDÍGENAS MEXICO' },
    { code: '940', name: 'INDÍGENAS BRASIL' },
    { code: '941', name: 'YERAL (NENGANTÚ)' },
    { code: '950', name: 'INDÍGENAS PANAMA' },
    { code: '960', name: 'INDIGENAS BOLIVIA' },
    { code: '970', name: 'MAYA (GUATEMALA)' },
    { code: '999', name: 'INDIGENA SIN INFORMACIÓN' },
  ];
  return db.insert(indigenousCommunities).values(values);
}

async function seedIndigenousReserves() {
  await db.delete(indigenousReserves);
  const values = [
    { id: 0, code: '0', name: 'OTRO' },
    { code: '1', name: 'NO TIENE' },
    { code: '760', name: 'ADUCHE' },
    { code: '761', name: 'ARARA' },
    { code: '762', name: 'CAMARITAGUA' },
    { code: '763', name: 'COMEYAFU' },
    { code: '764', name: 'CURARE-LOS INGLESES' },
    { code: '765', name: 'ISLA DE RONDA' },
    { code: '766', name: 'KILOM. 6 Y 11 CARRETERA LETICIA TARAPACA' },
    { code: '767', name: 'LA PLAYA' },
    { code: '768', name: 'MIRITI-PARANA' },
    { code: '769', name: 'MOCAGUA' },
    { code: '770', name: 'MONOCHOA' },
    { code: '771', name: 'NAZARETH' },
    { code: '772', name: 'NONUYA DE VILLAZUL' },
    { code: '773', name: 'PREDIO PUTUMAYO' },
    { code: '774', name: 'PUERTO CORDOBA' },
    { code: '775', name: 'PUERTO SABALO LOS MONOS' },
    { code: '776', name: 'PUERTO SANTANDER' },
    { code: '777', name: 'PUERTO TRIUNFO' },
    { code: '778', name: 'RIOS COTUHE Y PUTUMAYO.' },
    { code: '779', name: 'SAN ANTONIO DE LOS LAGOS Y SAN SEBASTIAN' },
    { code: '780', name: 'SAN JOSE DEL RIO' },
    { code: '781', name: 'SAN JUAN DE LOS PARENTES' },
    { code: '782', name: 'SANTA SOFIA Y EL PROGRESO' },
    { code: '783', name: 'TICUNA' },
    { code: '784', name: 'YAIGOJE-RIO APAPORIS' },
    { code: '785', name: 'CASTANAL' },
    { code: '786', name: 'TICOYA' },
    { code: '787', name: 'AMPARRADO ALTO Y MEDIO Y QUEBRADA CHONTADURO' },
    { code: '788', name: 'ANDABU' },
    { code: '789', name: 'BERNARDINO PANCHI' },
    { code: '790', name: 'CAIMAN NUEVO' },
    { code: '791', name: 'CANIME' },
    { code: '792', name: 'CANAVERALES ANTADO' },
    { code: '793', name: 'CHAQUENODA' },
    { code: '794', name: 'CHIMURRO Y NENDO' },
    { code: '795', name: 'CHONTADURAL CANERO' },
    { code: '796', name: 'CHOROMANDO ALTO Y MEDIO' },
    { code: '797', name: 'CHUSCAL Y TUGURIDOCITO' },
    { code: '798', name: 'CORIBI BEDADO' },
    { code: '799', name: 'CRISTIANIA' },
    { code: '800', name: 'DOKERAZAVI' },
    { code: '801', name: 'EL CHARCON' },
    { code: '802', name: 'EL SALADO' },
    { code: '803', name: 'EL VOLAO' },
    { code: '804', name: 'EMBERA DRUA' },
    { code: '805', name: 'GUAGUANDO' },
    { code: '806', name: 'HERMEREGILDO CHAKIAMA' },
    { code: '807', name: 'ITE' },
    { code: '808', name: 'JAIDEZAVI' },
    { code: '809', name: 'JAI-DUKAMA' },
    { code: '810', name: 'JAIKERAZAVI' },
    { code: '811', name: 'JENATURADO' },
    { code: '812', name: 'LA MARIA MARCELINO TASCON' },
    { code: '813', name: 'LA MIRLA' },
    { code: '814', name: 'LA PALMA' },
    { code: '815', name: 'LAS PLAYAS' },
    { code: '816', name: 'MAJORE-AMBURA' },
    { code: '817', name: 'MONZHOMANDO' },
    { code: '818', name: 'MURRI PANTANOS' },
    { code: '819', name: 'NARIKIZAVI' },
    { code: '820', name: 'NUSIDO' },
    { code: '821', name: 'PABLO MUERA' },
    { code: '822', name: 'POLINES' },
    { code: '823', name: 'PUERTO CLAVER' },
    { code: '824', name: 'RIO CHAJERADO' },
    { code: '825', name: 'RIO JARAPETO' },
    { code: '826', name: 'RIO MURINDO' },
    { code: '827', name: 'RIOS JENGADO APARTADO' },
    { code: '828', name: 'RIOS PAVARANDO Y AMPARRADO MEDIO' },
    { code: '829', name: 'SEVER' },
    { code: '830', name: 'TAGUAL-LA PO' },
    { code: '831', name: 'VALLE DE PERDIDAS' },
    { code: '832', name: 'YABERARADO' },
    { code: '833', name: 'VEGAS DE SEGOVIA' },
    { code: '834', name: 'ANGOSTURAS' },
    { code: '835', name: 'BAYONEROS' },
    { code: '836', name: 'CAJAROS' },
    { code: '837', name: 'CANANAMA' },
    { code: '838', name: 'CANO CLARO' },
    { code: '839', name: 'CIBARIZA' },
    { code: '840', name: 'CUILOTO II' },
    { code: '841', name: 'CUSAY O LA COLORADA' },
    { code: '842', name: 'EL VIGIA' },
    { code: '843', name: 'EL ZAMURO' },
    { code: '844', name: 'GENAREROS' },
    { code: '845', name: 'LA ESPERANZA' },
    { code: '846', name: 'LA ISLA' },
    { code: '847', name: 'LA VORAGINE-LA ILUSION' },
    { code: '848', name: 'LAGUNA TRANQUILA' },
    { code: '849', name: 'LOS IGUANITOS' },
    { code: '850', name: 'MACARIEROS' },
    { code: '851', name: 'PARREROS' },
    { code: '852', name: 'VALLES DEL SOL' },
    { code: '853', name: 'PUYEROS' },
    { code: '854', name: 'ROQUEROS' },
    { code: '855', name: 'SABANAS DE CURIPAO' },
    { code: '856', name: 'SAN JOSE DE LIPA O CANO COLORADO' },
    { code: '857', name: 'MOKANA DE BARANOA' },
    { code: '858', name: 'MOKANA DE GALAPA' },
    { code: '859', name: 'MOKANA DE MALAMBO' },
    { code: '860', name: 'MOKANA DE PUERTO COLOMBIA' },
    { code: '861', name: 'AMBIKA' },
    { code: '862', name: 'CAMAINKIBO - INGA KICHWA' },
    { code: '863', name: 'INGA DE BOGOTA' },
    { code: '864', name: 'MUISA DE SUBA' },
    { code: '865', name: 'MUISCA DE BOSA' },
    { code: '866', name: 'GAMBOTE' },
    { code: '867', name: 'NUEVO PORVENIR DE RETIRO NUEVO' },
    { code: '868', name: 'LA PISTA' },
    { code: '869', name: 'MOTOR DUCHAKE ALTO NACABERDWUA' },
    { code: '870', name: 'UNIDO UWA' },
    { code: '871', name: 'CANOMOMO LOMAPRIETA' },
    { code: '872', name: 'CAUROMA (CERRO TACON)' },
    { code: '873', name: 'ESCOPETERA Y PIRZA' },
    { code: '874', name: 'LA ALBANIA' },
    { code: '875', name: 'LA MONTANA' },
    { code: '876', name: 'SAN LORENZO' },
    { code: '877', name: 'TOTUMAL' },
    { code: '878', name: 'AGUAS NEGRAS' },
    { code: '879', name: 'ALTAMIRA' },
    { code: '880', name: 'COROPOYA' },
    { code: '881', name: 'CUSUMBE - AGUA BLANCA' },
    { code: '882', name: 'EL CEDRITO' },
    { code: '883', name: 'EL GUAYABAL' },
    { code: '884', name: 'EL LIBANO' },
    { code: '885', name: 'EL PORTAL' },
    { code: '886', name: 'EL QUINCE' },
    { code: '887', name: 'EL TRIUNFO' },
    { code: '888', name: 'GETUCHA' },
    { code: '889', name: 'GORGONIA' },
    { code: '890', name: 'HERICHA' },
    { code: '891', name: 'HONDURAS' },
    { code: '892', name: 'JACOME' },
    { code: '893', name: 'JERICO CONSAYA' },
    { code: '894', name: 'LA CERINDA' },
    { code: '895', name: 'LA SIBERIA' },
    { code: '896', name: 'LA TEOFILA' },
    { code: '897', name: 'LAS BRISAS' },
    { code: '898', name: 'LLANOS DE YARI (YAGUARA II )' },
    { code: '899', name: 'LOS PIJAOS' },
    { code: '900', name: 'MATICURU' },
    { code: '901', name: 'MESAI (antes Amenanae-Charco del NiNo Dios)' },
    { code: '902', name: 'NASSA KIWE (CENTRO INDIGENA)' },
    { code: '903', name: 'NINERAS' },
    { code: '904', name: 'PORVENIR KANANGUCHAL' },
    { code: '905', name: 'PUERTO NARANJO PENAS ROJAS' },
    { code: '906', name: 'PUERTO SABALO LOS MONOS' },
    { code: '907', name: 'SAN ANTONIO DEL FRAGUA' },
    { code: '908', name: 'SAN LUIS' },
    { code: '909', name: 'SAN MIGUEL' },
    { code: '910', name: 'SAN PABLO EL PARA' },
    { code: '911', name: 'WITORA O HUITORA' },
    { code: '912', name: 'YURAYACO' },
    { code: '913', name: 'ZIT-SEK DEL QUECAL' },
    { code: '914', name: 'BANDERAS DEL RECAIBO' },
    { code: '915', name: 'LA LIBERTAD 2' },
    { code: '916', name: 'MORICHITO Y CANO MOCHUELO' },
    { code: '917', name: 'CHAPARRAL Y BARRONEGRO' },
    { code: '918', name: 'EL CONSEJO' },
    { code: '919', name: 'EL DUYA' },
    { code: '920', name: 'SAN JUANITO' },
    { code: '921', name: 'PARAVARE' },
    { code: '922', name: 'EL MEDANO' },
    { code: '923', name: 'EL SUSPIRO RINCON EL SOCORRO' },
    { code: '924', name: 'MACUCUANA' },
    { code: '925', name: 'SALADILLO' },
    { code: '926', name: 'AGUA NEGRA' },
    { code: '927', name: 'INFI' },
    { code: '928', name: 'ALMORZADERO' },
    { code: '929', name: 'ALTO DEL REY' },
    { code: '930', name: 'AMBALO' },
    { code: '931', name: 'AVIRAMA' },
    { code: '932', name: 'BELALCAZAR' },
    { code: '933', name: 'BELEN DE IGUANA' },
    { code: '934', name: 'NUEVA BELLAVISTA' },
    { code: '935', name: 'GUAMBIANO LA BONANZA' },
    { code: '936', name: 'CALDERAS' },
    { code: '937', name: 'CALLE SANTA ROSA - RIO SAIJA' },
    { code: '938', name: 'CANOAS' },
    { code: '939', name: 'CAQUIONA' },
    { code: '940', name: 'CHIMBORAZO' },
    { code: '941', name: 'CHINAS' },
    { code: '942', name: 'KOKONUKO' },
    { code: '943', name: 'COHETANDO' },
    { code: '944', name: 'CXAYUCE FIW' },
    { code: '945', name: 'EL PENON' },
    { code: '946', name: 'MUSSE UKWE' },
    { code: '947', name: 'COMUNIDAD URBANA' },
    { code: '948', name: 'PAEZ DE CORINTO ( LOPEZ ADENTRO)' },
    { code: '949', name: 'EL MORAL' },
    { code: '950', name: 'EL OSO' },
    { code: '951', name: 'FLORESTA LA ESPANOLA' },
    { code: '952', name: 'FRONTINO' },
    { code: '953', name: 'GUACHICONO' },
    { code: '954', name: 'GUADUALITO (FNA)' },
    { code: '955', name: 'GUAMBIA' },
    { code: '956', name: 'GUARAPAMBA' },
    { code: '957', name: 'GUAYUYACO' },
    { code: '958', name: 'HUELLAS' },
    { code: '959', name: 'HUILA' },
    { code: '960', name: 'ISLA DEL MONO' },
    { code: '961', name: 'JAMBALO' },
    { code: '962', name: 'JEBALA' },
    { code: '963', name: 'JUAN TAMA' },
    { code: '964', name: 'KITEK KIWE' },
    { code: '965', name: 'LA AGUADA SAN ANTONIO' },
    { code: '966', name: 'LA CILIA O LA CALERA' },
    { code: '967', name: 'LA CONCEPCION' },
    { code: '968', name: 'LA GAITANA' },
    { code: '969', name: 'LA LAGUNA - SIBERIA' },
    { code: '970', name: 'LA LEONA' },
    { code: '971', name: 'LA MARIA' },
    { code: '972', name: 'LA PAILA NAYA' },
    { code: '973', name: 'LA PLAYITA JUAN COBO' },
    { code: '974', name: 'LA PLAYITA SAN FRANCISCO' },
    { code: '975', name: 'LA REFORMA ALTO SAN MIGUEL' },
    { code: '976', name: 'LAME' },
    { code: '977', name: 'LAS DELICIAS' },
    { code: '978', name: 'LAS MERCEDES' },
    { code: '979', name: 'MANDIYACO' },
    { code: '980', name: 'MOSOCO' },
    { code: '981', name: 'NASA KIWE TEKH KSXAW' },
    { code: '982', name: 'NOVIRAO' },
    { code: '983', name: 'PALETARA' },
    { code: '984', name: 'PANCITARA' },
    { code: '985', name: 'PANIQUITA' },
    { code: '986', name: 'PAPALLAQTA' },
    { code: '987', name: 'PARTIDERO' },
    { code: '988', name: 'PATH YU' },
    { code: '989', name: 'PICKWE THA FIW' },
    { code: '990', name: 'PIOYA' },
    { code: '991', name: 'PITAYO' },
    { code: '992', name: 'PLAYA BENDITA' },
    { code: '993', name: 'PLAYON NASA NAYA' },
    { code: '994', name: 'POBLAZON' },
    { code: '995', name: 'POLINDARA' },
    { code: '996', name: 'PUEBLO NUEVO' },
    { code: '997', name: 'PUEBLO NUEVO CERAL' },
    { code: '998', name: 'PURACE' },
    { code: '999', name: 'QUICHAYA' },
    { code: '1000', name: 'QUINTANA-PAEZ' },
    { code: '1001', name: 'QUIZGO' },
    { code: '1002', name: 'RICAURTE' },
    { code: '1003', name: 'RIO BLANCO' },
    { code: '1004', name: 'RIO GUANGUI' },
    { code: '1005', name: 'SAN ANDRES DE PISIMBALA' },
    { code: '1006', name: 'SAN FRANCISCO' },
    { code: '1007', name: 'SAN GABRIEL DEL FRAGUA' },
    { code: '1008', name: 'SAN JOAQUIN' },
    { code: '1009', name: 'SAN JOSE' },
    { code: '1010', name: 'SAN JOSE DE INCHIYACO' },
    { code: '1011', name: 'SAN LORENZO DE CALDONO' },
    { code: '1012', name: 'SAN RAFAEL' },
    { code: '1013', name: 'SAN SEBASTIAN' },
    { code: '1014', name: 'SANTA MARTA' },
    { code: '1015', name: 'SANTA ROSA DE CAPICISCO' },
    { code: '1016', name: 'SUIN' },
    { code: '1017', name: 'TACUEYO' },
    { code: '1018', name: 'TALAGA' },
    { code: '1019', name: 'TIGRES Y MUNCHIQUE' },
    { code: '1020', name: 'TOEZ' },
    { code: '1021', name: 'TOGOIMA' },
    { code: '1022', name: 'TORIBIO' },
    { code: '1023', name: 'TOTORO' },
    { code: '1024', name: 'TUMBICHUCUE' },
    { code: '1025', name: 'TUMBURAO' },
    { code: '1026', name: 'TURMINA' },
    { code: '1027', name: 'VITONCO' },
    { code: '1028', name: 'WASIPANGA' },
    { code: '1029', name: 'YAQUIVA' },
    { code: '1030', name: 'OVEJAS SIBERIA' },
    { code: '1031', name: 'RUMINAWI' },
    { code: '1032', name: 'ARHUACO DE LA SIERRA NEVADA' },
    { code: '1033', name: 'BUSINCHAMA' },
    { code: '1034', name: 'CAMPO ALEGRE' },
    { code: '1035', name: 'CANO PADILLA' },
    { code: '1036', name: 'EL ROSARIO' },
    { code: '1037', name: 'IROKA' },
    { code: '1038', name: 'KANKUAMO' },
    { code: '1039', name: 'LA LAGUNA' },
    { code: '1040', name: 'MENKUE-MISAYA-LA PISTA' },
    { code: '1041', name: 'SOCORPA' },
    { code: '1042', name: 'SAN ANTONIO DE TOGOROMA' },
    { code: '1043', name: 'ABEJERO' },
    { code: '1044', name: 'DEARADE - BIAKIRUDE' },
    { code: '1045', name: 'AGUACLARA Y BELLA LUZ DEL RIO AMPARO' },
    { code: '1046', name: 'ALTO BONITO VIRA VIRA' },
    { code: '1047', name: 'RIO NAPIPI' },
    { code: '1048', name: 'PUERTO ANTIOQUIA' },
    { code: '1049', name: 'ALTO RIO BOJAYA' },
    { code: '1050', name: 'PAINA' },
    { code: '1051', name: 'QUEBRADA CHICUE RIO TANGUI' },
    { code: '1052', name: 'GUARANDO - CARRIZAL' },
    { code: '1053', name: 'LA LOMITA' },
    { code: '1054', name: 'MIASA DE PARTADO' },
    { code: '1055', name: 'MOTORDO' },
    { code: '1056', name: 'MUNGARADO' },
    { code: '1057', name: 'ALTO RIO BUEY' },
    { code: '1058', name: 'ALTO RIO CUIA' },
    { code: '1059', name: 'ALTO RIO TAGACHI' },
    {
      code: '1060',
      name: 'AME',
    },
    {
      code: '1061',
      name: 'ARQUIA',
    },
    {
      code: '1062',
      name: 'RIO CUTI',
    },
    {
      code: '1063',
      name: 'TANELA',
    },
    {
      code: '1064',
      name: 'EYAKERA TUMURRULA',
    },
    {
      code: '1065',
      name: 'TARENA',
    },
    {
      code: '1066',
      name: 'BOCHOROMA Y BOCHOROMACITO',
    },
    {
      code: '1067',
      name: 'BUCHADO AMPARRADO',
    },
    {
      code: '1068',
      name: 'BUENAVISTA',
    },
    {
      code: '1069',
      name: 'CABECERAS O PUERTO PIZARIO',
    },
    {
      code: '1070',
      name: 'CAIMANERO DE JAMPAPA',
    },
    {
      code: '1071',
      name: 'CHAGPIEN TORDO',
    },
    {
      code: '1072',
      name: 'CHIDIMA TOLO',
    },
    {
      code: '1073',
      name: 'CHIGORODO MEMBA',
    },
    {
      code: '1074',
      name: 'COPE DEL RIO INGARA',
    },
    {
      code: '1075',
      name: 'DOBIDA DOGIBI',
    },
    {
      code: '1076',
      name: 'DO IMAMA TUMA Y BELLA LUZ',
    },
    {
      code: '1077',
      name: 'DOCORDO BALSALITO',
    },
    {
      code: '1078',
      name: 'DOMINICO-LONDONO-APARTADO',
    },
    {
      code: '1079',
      name: 'EL DOCE O QUEBRADA BORBOLLON',
    },
    {
      code: '1080',
      name: 'EL VEINTE',
    },
    {
      code: '1081',
      name: 'EL VEINTIUNO',
    },
    {
      code: '1082',
      name: 'GEGORA',
    },
    {
      code: '1083',
      name: 'GUADUALITO',
    },
    {
      code: '1084',
      name: 'GUAYABAL DE PARTADO',
    },
    {
      code: '1085',
      name: 'HURTADO Y TEGAVERA',
    },
    {
      code: '1086',
      name: 'JAGUAL RÃO CHINTADO',
    },
    {
      code: '1087',
      name: 'JURADO',
    },
    {
      code: '1088',
      name: 'LA CRISTALINA',
    },
    {
      code: '1089',
      name: 'LA JAGUA - GUACHAL PITALITO',
    },
    {
      code: '1090',
      name: 'LA PURIA',
    },
    {
      code: '1091',
      name: 'LA RAYA',
    },
    {
      code: '1092',
      name: 'LANAS',
    },
    {
      code: '1093',
      name: 'SABALETA',
    },
    {
      code: '1094',
      name: 'MAMEY DE DIPURDU',
    },
    {
      code: '1095',
      name: 'BOCHOROMA BOCHOROMACITO',
    },
    {
      code: '1096',
      name: 'MONDO MONDOCITO',
    },
    {
      code: '1097',
      name: 'MUNGUIDO',
    },
    {
      code: '1098',
      name: 'NUEVO PITALITO',
    },
    {
      code: '1099',
      name: 'NUSSI PURRU',
    },
    {
      code: '1100',
      name: 'OPOGADO DOGUADO',
    },
    {
      code: '1101',
      name: 'ORDO SIVIRU AGUA CLARA',
    },
    {
      code: '1102',
      name: 'PAPAYO',
    },
    {
      code: '1103',
      name: 'PARED Y PARECITO',
    },
    {
      code: '1104',
      name: 'PATIO BONITO',
    },
    {
      code: '1105',
      name: 'PENA BLANCA RIO TRUANDO',
    },
    {
      code: '1106',
      name: 'PENAS DEL OLVIDO',
    },
    {
      code: '1107',
      name: 'PERANCHITO',
    },
    {
      code: '1108',
      name: 'PERANCHO',
    },
    {
      code: '1109',
      name: 'PESCADITO',
    },
    {
      code: '1110',
      name: 'PICHICORA',
    },
    {
      code: '1111',
      name: 'PUADO MATARE LA LERMA Y TERDO',
    },
    {
      code: '1112',
      name: 'PUERTO ALEGRE Y LA DIVISA',
    },
    {
      code: '1113',
      name: 'PUERTO LIBIA TRIPICAY',
    },
    {
      code: '1114',
      name: 'PUERTO LIBRE DEL RIO PEPE',
    },
    {
      code: '1115',
      name: 'QUEBRADA QUERA',
    },
    {
      code: '1116',
      name: 'RIO BEBARA',
    },
    {
      code: '1117',
      name: 'RIO BEBARAMA',
    },
    {
      code: '1118',
      name: 'BURUJON O LA UNION SAN BERNARDO',
    },
    {
      code: '1119',
      name: 'RIO DOMINGODO',
    },
    {
      code: '1120',
      name: 'RIO ICHO Y QUEBRADA BARATUDO',
    },
    {
      code: '1121',
      name: 'RIO LA PLAYA',
    },
    {
      code: '1122',
      name: 'RIO MUMBU',
    },
    {
      code: '1123',
      name: 'RIO NEGUA',
    },
    {
      code: '1124',
      name: 'RIO NUQUI',
    },
    {
      code: '1125',
      name: 'RIO ORPUA',
    },
    {
      code: '1126',
      name: 'RIO PANGUI',
    },
    {
      code: '1127',
      name: 'RIO PAVASA Y QUEBRADA JELLA',
    },
    {
      code: '1128',
      name: 'RIO PICHIMA',
    },
    {
      code: '1129',
      name: 'RIO PURRICHA',
    },
    {
      code: '1130',
      name: 'RÃO QUIPARADO',
    },
    {
      code: '1131',
      name: 'RIO QUIPARADO',
    },
    {
      code: '1132',
      name: 'RIO TAPARAL',
    },
    {
      code: '1133',
      name: 'RÃOS TORREIDÃ“ Y CHIMANI',
    },
    {
      code: '1134',
      name: 'RIOS TORREIDÃ“ Y CHIMANI',
    },
    {
      code: '1135',
      name: 'RIOS CATRU DUBASA Y ANCOSO',
    },
    {
      code: '1136',
      name: 'RIOS JURUBIDA CHORI Y ALTO BAUDO',
    },
    {
      code: '1137',
      name: 'RIOS PATO Y JENGADO',
    },
    {
      code: '1138',
      name: 'RIOS TUNGINA Y APARTADO',
    },
    {
      code: '1139',
      name: 'RIOS UVA Y POGUE -QUEBRADA TAPARAL',
    },
    {
      code: '1140',
      name: 'VILLANUEVA JUNA',
    },
    {
      code: '1141',
      name: 'RIOS VALLE Y BOROBORO',
    },
    {
      code: '1142',
      name: 'SABALETERA',
    },
    {
      code: '1143',
      name: 'SALAQUI PAVARANDO',
    },
    {
      code: '1144',
      name: 'SAN JOSE AMIA DE PATO',
    },
    {
      code: '1145',
      name: 'SANANDOCITO',
    },
    {
      code: '1146',
      name: 'SANTA CECILIA DE LA QUEBRADA DE ORO CHOCO',
    },
    {
      code: '1147',
      name: 'SANTA MARIA DE PANGALA',
    },
    {
      code: '1148',
      name: 'SANTA MARTA DE CURICHE',
    },
    {
      code: '1149',
      name: 'SANTA ROSA DE IJUA',
    },
    {
      code: '1150',
      name: 'SANTA ROSA DE IJUA',
    },
    {
      code: '1151',
      name: 'SIRENA BERRECUY',
    },
    {
      code: '1152',
      name: 'TAHAMY DEL ALTO ANDAGUEDA',
    },
    {
      code: '1153',
      name: 'TOKOLLORO',
    },
    {
      code: '1154',
      name: 'TRAPICHE DEL RIO PEPE',
    },
    {
      code: '1155',
      name: 'UNION CHOCO-SAN CRISTOBAL',
    },
    {
      code: '1156',
      name: 'UNION CHOCO SAN CRISTOBAL',
    },
    {
      code: '1157',
      name: 'URADA JIGUAMIANDO',
    },
    {
      code: '1158',
      name: 'WANCHIRADO',
    },
    {
      code: '1159',
      name: 'YARUMAL Y EL BARRANCO',
    },
    {
      code: '1160',
      name: 'EL CONTENTO',
    },
    {
      code: '1161',
      name: 'EL CORRAL',
    },
    {
      code: '1162',
      name: 'SAN ANDRES DE SOTAVENTO',
    },
    {
      code: '1163',
      name: 'AGUAS VIVAS',
    },
    {
      code: '1164',
      name: 'ALTO SINU',
    },
    {
      code: '1165',
      name: 'ALTO SINU',
    },
    {
      code: '1166',
      name: 'ARENA',
    },
    {
      code: '1167',
      name: 'ARENAL',
    },
    {
      code: '1168',
      name: 'ASERRADERO',
    },
    {
      code: '1169',
      name: 'BAJO GRANDE',
    },
    {
      code: '1170',
      name: 'BANGARA DANTA',
    },
    {
      code: '1171',
      name: 'BARRO PRIETO',
    },
    {
      code: '1172',
      name: 'BATATAL',
    },
    {
      code: '1173',
      name: 'BLEO BERDINAL',
    },
    {
      code: '1174',
      name: 'BOCON BETULIA',
    },
    {
      code: '1175',
      name: 'CACAOTAL',
    },
    {
      code: '1176',
      name: 'CALLE RALITA',
    },
    {
      code: '1177',
      name: 'CAPIRRA',
    },
    {
      code: '1178',
      name: 'CARRANZO',
    },
    {
      code: '1179',
      name: 'CHINU URBANO',
    },
    {
      code: '1180',
      name: 'BELLO HORIZONTE DORADA',
    },
    {
      code: '1181',
      name: 'BOCAS DE URE',
    },
    {
      code: '1182',
      name: 'QUEBRADA CANAVERAL-RIO SAN JORGE',
    },
    {
      code: '1183',
      name: 'BUENOS AIRES ABAJO',
    },
    {
      code: '1184',
      name: 'CANDELARIA',
    },
    {
      code: '1185',
      name: 'CARACOLI',
    },
    {
      code: '1186',
      name: 'CENTROAMERICA',
    },
    {
      code: '1187',
      name: 'EL PORVENIR LA RICA',
    },
    {
      code: '1188',
      name: 'EL SANTUARIO',
    },
    {
      code: '1189',
      name: 'EL TAMBO',
    },
    {
      code: '1190',
      name: 'GUACARI',
    },
    {
      code: '1191',
      name: 'LA LIBERTAD PICA PICA VIEJO',
    },
    {
      code: '1192',
      name: 'LA LIBORIA',
    },
    {
      code: '1193',
      name: 'LA LUCHA',
    },
    {
      code: '1194',
      name: 'LA UNION MORROCOY',
    },
    {
      code: '1195',
      name: 'LAS FLORES DE CORDOBA Y MARGARITAS',
    },
    {
      code: '1196',
      name: 'MIRAFLOR',
    },
    {
      code: '1197',
      name: 'PICA PICA NUEVO',
    },
    {
      code: '1198',
      name: 'PIEDRAS VIVAS URE',
    },
    {
      code: '1199',
      name: 'PUERTO NUEVO',
    },
    {
      code: '1200',
      name: 'RANCHO GRANDE',
    },
    {
      code: '1201',
      name: 'SANTA FE LAS CLARAS',
    },
    {
      code: '1202',
      name: 'TORNO ROJO',
    },
    {
      code: '1203',
      name: 'VENDE AGUJAS',
    },
    {
      code: '1204',
      name: 'VIDA NUEVA',
    },
    {
      code: '1205',
      name: 'VILLA CARMINIA',
    },
    {
      code: '1206',
      name: 'VILLA NUEVA',
    },
    {
      code: '1207',
      name: 'VILLA PORVENIR',
    },
    {
      code: '1208',
      name: 'SANTA FE ALTO SAN JORGE',
    },
    {
      code: '1209',
      name: 'EL BUGRE',
    },
    {
      code: '1210',
      name: 'EL PITAL',
    },
    {
      code: '1211',
      name: 'ESCOBALITO',
    },
    {
      code: '1212',
      name: 'FLECHA CEVILLA',
    },
    {
      code: '1213',
      name: 'HUESO',
    },
    {
      code: '1214',
      name: 'IBUDO BOSQUE',
    },
    {
      code: '1215',
      name: 'KIPARA',
    },
    {
      code: '1216',
      name: 'LAS LOMAS',
    },
    {
      code: '1217',
      name: 'MOHAN CUATRO VIENTOS',
    },
    {
      code: '1218',
      name: 'MOMIL URBANO',
    },
    {
      code: '1219',
      name: 'PALMITAL',
    },
    {
      code: '1220',
      name: 'PEREIRA',
    },
    {
      code: '1221',
      name: 'PLANADA VILLERO',
    },
    {
      code: '1222',
      name: 'PORVENIR',
    },
    {
      code: '1223',
      name: 'RETIRO DE LOS PEREZ',
    },
    {
      code: '1224',
      name: 'SABANETA',
    },
    {
      code: '1225',
      name: 'SACANA',
    },
    {
      code: '1226',
      name: 'SAHAGUN URBANO',
    },
    {
      code: '1227',
      name: 'SAN ANTONIO DE TACHIRA',
    },
    {
      code: '1228',
      name: 'SAN BENITO',
    },
    {
      code: '1229',
      name: 'ARROYO DEL MEDIO',
    },
    {
      code: '1230',
      name: 'SAN GREGORIO',
    },
    {
      code: '1231',
      name: 'SAN JOSE CERRO MOHAN',
    },
    {
      code: '1232',
      name: 'SAN JOSE LA JULIA',
    },
    {
      code: '1233',
      name: 'SAN JUAN DE LAS PALMAS',
    },
    {
      code: '1234',
      name: 'SAN PEDRO URBANO DE SANTA CRUZ DE LORICA',
    },
    {
      code: '1235',
      name: 'SANTANDER DE LA CRUZ',
    },
    {
      code: '1236',
      name: 'SITIO NUEVO',
    },
    {
      code: '1237',
      name: 'TAMARINDO',
    },
    {
      code: '1238',
      name: 'TOADO',
    },
    {
      code: '1239',
      name: 'TREMENTINO',
    },
    {
      code: '1240',
      name: 'TUCHIN URBANO',
    },
    {
      code: '1241',
      name: 'URBANO DE SAN ANTERO',
    },
    {
      code: '1242',
      name: 'VENECIA',
    },
    {
      code: '1243',
      name: 'VILLA FATIMA',
    },
    {
      code: '1244',
      name: 'MUISCA DE FONQUETA Y CERCA DE PIEDRA',
    },
    {
      code: '1245',
      name: 'COMUNIDAD MUISCA',
    },
    {
      code: '1246',
      name: 'ALMIDON LA CEIBA',
    },
    {
      code: '1247',
      name: 'ARRECIFAL',
    },
    {
      code: '1248',
      name: 'BACHACO BUENA VISTA',
    },
    {
      code: '1249',
      name: 'BAJO RIO GUAINIA Y RIO NEGRO',
    },
    {
      code: '1250',
      name: 'CARRIZAL',
    },
    {
      code: '1251',
      name: 'COAYARE EL COCO',
    },
    {
      code: '1252',
      name: 'CUMARAL GUAMUCO',
    },
    {
      code: '1253',
      name: 'EL VENADO',
    },
    {
      code: '1254',
      name: 'TIERRA ALTA',
    },
    {
      code: '1255',
      name: 'CARANACOA YURI -LAGUNA MOROCOTO',
    },
    {
      code: '1256',
      name: 'CARPINTERO PALOMAS',
    },
    {
      code: '1257',
      name: 'CHIGUIRO',
    },
    {
      code: '1258',
      name: 'CONCORDIA',
    },
    {
      code: '1259',
      name: 'CUENCA MEDIA Y ALTA DEL RIO INIRIDA',
    },
    {
      code: '1260',
      name: 'GUACO BAJO Y GUACO ALTO',
    },
    {
      code: '1261',
      name: 'LAGUNA CURVINA SAPUARA',
    },
    {
      code: '1262',
      name: 'LAGUNA NINAL',
    },
    {
      code: '1263',
      name: 'MINITAS MIRALINDO',
    },
    {
      code: '1264',
      name: 'MURCIELAGO ALTAMIRA',
    },
    {
      code: '1265',
      name: 'PARTE ALTA DEL RIO GUAINIA',
    },
    {
      code: '1266',
      name: 'PAUJIL',
    },
    {
      code: '1267',
      name: 'PUEBLO NUEVO LAGUNA COLORADA',
    },
    {
      code: '1268',
      name: 'REMANSO CHORROBOCON',
    },
    {
      code: '1269',
      name: 'RIO ATABAPO E INIRIDA',
    },
    {
      code: '1270',
      name: 'RIOS CUIARE E ISANA',
    },
    {
      code: '1271',
      name: 'TONINA-SEJAL-SAN JOSE - OTROS',
    },
    {
      code: '1272',
      name: 'CARRAIPIA*',
    },
    {
      code: '1273',
      name: 'OKOCHI',
    },
    {
      code: '1274',
      name: 'TRUPIOGACHO Y LA MESETA',
    },
    {
      code: '1275',
      name: 'TAMAQUITO II',
    },
    {
      code: '1276',
      name: 'BARRANCON',
    },
    {
      code: '1277',
      name: 'CAMPOALEGRE',
    },
    {
      code: '1278',
      name: 'ORONOKIAO',
    },
    {
      code: '1279',
      name: 'ALTA Y MEDIA GUAJIRA',
    },
    {
      code: '1280',
      name: 'WOPUMUIN JUNAIN MAIKOU',
    },
    {
      code: '1281',
      name: 'CAMPO FLORIDO',
    },
    {
      code: '1282',
      name: 'KULEMATAMANA',
    },
    {
      code: '1283',
      name: 'MOCUMANA',
    },
    {
      code: '1284',
      name: 'PALASUMANA',
    },
    {
      code: '1285',
      name: 'SAN LUIS KILOMETRO 66 VIA RIOHACHA',
    },
    {
      code: '1286',
      name: 'SICHIMANA',
    },
    {
      code: '1287',
      name: 'TRANQUET',
    },
    {
      code: '1288',
      name: 'WARRELLO',
    },
    {
      code: '1289',
      name: 'WAYATAMANA',
    },
    {
      code: '1290',
      name: 'MANATURE',
    },
    {
      code: '1291',
      name: 'MONTE HARMON',
    },
    {
      code: '1292',
      name: 'ALUWATACHON No. 3',
    },
    {
      code: '1293',
      name: 'ALUWATACSHY PIOULE',
    },
    {
      code: '1294',
      name: 'AMAKIMANA',
    },
    {
      code: '1295',
      name: 'AMALETA',
    },
    {
      code: '1296',
      name: 'AMAMANA',
    },
    {
      code: '1297',
      name: 'AMARIJUNA',
    },
    {
      code: '1298',
      name: 'AMOUC',
    },
    {
      code: '1299',
      name: 'AMURUREN',
    },
    {
      code: '1300',
      name: 'ANERRUTAMANA',
    },
    {
      code: '1301',
      name: 'ANUACHY',
    },
    {
      code: '1302',
      name: 'ANUTPALAKA',
    },
    {
      code: '1303',
      name: 'ARENOSA',
    },
    {
      code: '1304',
      name: 'ARITAMANA',
    },
    {
      code: '1305',
      name: 'ATACARA',
    },
    {
      code: '1306',
      name: 'ATACAT No. 1',
    },
    {
      code: '1307',
      name: 'ATOULIA',
    },
    {
      code: '1308',
      name: 'AULALIA',
    },
    {
      code: '1309',
      name: 'AYPIAMANA',
    },
    {
      code: '1310',
      name: 'BANDERA',
    },
    {
      code: '1311',
      name: 'BELLO MONTE',
    },
    {
      code: '1312',
      name: 'POTRERITO',
    },
    {
      code: '1313',
      name: 'CAICEMAPA',
    },
    {
      code: '1314',
      name: 'CALABACITO',
    },
    {
      code: '1315',
      name: 'CALAN',
    },
    {
      code: '1316',
      name: 'CALATA',
    },
    {
      code: '1317',
      name: 'CALATAINS',
    },
    {
      code: '1318',
      name: 'CALAUNE',
    },
    {
      code: '1319',
      name: 'CALETAMANA',
    },
    {
      code: '1320',
      name: 'CAMPAMENTO',
    },
    {
      code: '1321',
      name: 'CAMPANA',
    },
    {
      code: '1322',
      name: 'CAMPOMANA',
    },
    {
      code: '1323',
      name: 'CAMPUMANA',
    },
    {
      code: '1324',
      name: 'CANA',
    },
    {
      code: '1325',
      name: 'CANA LARGA',
    },
    {
      code: '1326',
      name: 'CANO SECO',
    },
    {
      code: '1327',
      name: 'CAPCHIMANA',
    },
    {
      code: '1328',
      name: 'CAPCHIRMANA',
    },
    {
      code: '1329',
      name: 'CARRACARRAICHON',
    },
    {
      code: '1330',
      name: 'CARRAPATAMANA',
    },
    {
      code: '1331',
      name: 'CARRAYCIRA',
    },
    {
      code: '1332',
      name: 'CASISCAT',
    },
    {
      code: '1333',
      name: 'CASUSHIMANA',
    },
    {
      code: '1334',
      name: 'CASUTAREN',
    },
    {
      code: '1335',
      name: 'CASUTO',
    },
    {
      code: '1336',
      name: 'CEIWACA',
    },
    {
      code: '1337',
      name: 'RODEITO EL POZO',
    },
    {
      code: '1338',
      name: 'CERRO DE HATONUEVO',
    },
    {
      code: '1339',
      name: 'CERRODEO (2 comunidades)',
    },
    {
      code: '1340',
      name: 'CEXCULUMANA',
    },
    {
      code: '1341',
      name: 'CHICHISHI',
    },
    {
      code: '1342',
      name: 'CHICHITUY',
    },
    {
      code: '1343',
      name: 'CHIITEN',
    },
    {
      code: '1344',
      name: 'CHIRIYUCA',
    },
    {
      code: '1345',
      name: 'CHOLOISIRA',
    },
    {
      code: '1346',
      name: 'CHURRASIT',
    },
    {
      code: '1347',
      name: 'CLESIALA',
    },
    {
      code: '1348',
      name: 'COCHORRETAMANA',
    },
    {
      code: '1349',
      name: 'COLONUTSU',
    },
    {
      code: '1350',
      name: 'COUCHAMANA',
    },
    {
      code: '1351',
      name: 'CUARARAIKIOC',
    },
    {
      code: '1352',
      name: 'CUATRO BOCAS',
    },
    {
      code: '1353',
      name: 'CUATRO DE NOVIEMBRE',
    },
    {
      code: '1354',
      name: 'CUSINAMANA',
    },
    {
      code: '1355',
      name: 'ECCHAMANA',
    },
    {
      code: '1356',
      name: 'EL CHORRO',
    },
    {
      code: '1357',
      name: 'EL MERCADO',
    },
    {
      code: '1358',
      name: 'EL SENDERO',
    },
    {
      code: '1359',
      name: 'EL ZAHINO-GUAYABITO MURIAYTUY',
    },
    {
      code: '1360',
      name: 'ERAPU LA RAYA',
    },
    {
      code: '1361',
      name: 'ESPERANZA',
    },
    {
      code: '1362',
      name: 'FLOR DE LA GUAJIRA',
    },
    {
      code: '1363',
      name: 'GALAN',
    },
    {
      code: '1364',
      name: 'GAUSACHON',
    },
    {
      code: '1365',
      name: 'GUAAPANA',
    },
    {
      code: '1366',
      name: 'GUADALAJARA',
    },
    {
      code: '1367',
      name: 'GUANAKAT',
    },
    {
      code: '1368',
      name: 'GUARRALAKATSHI',
    },
    {
      code: '1369',
      name: 'GUARRARACHON',
    },
    {
      code: '1370',
      name: 'GUAYABITA',
    },
    {
      code: '1371',
      name: 'GUINEOMANA',
    },
    {
      code: '1372',
      name: 'HEREIRAPU',
    },
    {
      code: '1373',
      name: 'HICHIKEPU',
    },
    {
      code: '1374',
      name: 'HOULUY',
    },
    {
      code: '1375',
      name: 'HURRAYCHICHON',
    },
    {
      code: '1376',
      name: 'HUWAIN',
    },
    {
      code: '1377',
      name: 'ICHITU',
    },
    {
      code: '1378',
      name: 'ILLA',
    },
    {
      code: '1379',
      name: 'ISALAMANA',
    },
    {
      code: '1380',
      name: 'ISHAPA',
    },
    {
      code: '1381',
      name: 'ISHOU',
    },
    {
      code: '1382',
      name: 'ISHOWROYO',
    },
    {
      code: '1383',
      name: 'JAIPAREIM',
    },
    {
      code: '1384',
      name: 'JASAICHON',
    },
    {
      code: '1385',
      name: 'JASALIMA',
    },
    {
      code: '1386',
      name: 'JATSUMANA',
    },
    {
      code: '1387',
      name: 'JATTO (KILOMETRO 30 VIA ALBANIA)',
    },
    {
      code: '1388',
      name: 'JELLUSIRRA',
    },
    {
      code: '1389',
      name: 'JEPICA',
    },
    {
      code: '1390',
      name: 'JEPIKA',
    },
    {
      code: '1391',
      name: 'JEPINA',
    },
    {
      code: '1392',
      name: 'JER RET',
    },
    {
      code: '1393',
      name: 'JEYURSUPAA',
    },
    {
      code: '1394',
      name: 'JICHITCA',
    },
    {
      code: '1395',
      name: 'JIKAT',
    },
    {
      code: '1396',
      name: 'JIM NUTAMANA',
    },
    {
      code: '1397',
      name: 'JIMAIN',
    },
    {
      code: '1398',
      name: 'JIRRUMANA',
    },
    {
      code: '1399',
      name: 'JOUMANA',
    },
    {
      code: '1400',
      name: 'JULUWAJUNA',
    },
    {
      code: '1401',
      name: 'JULUWAWAIN',
    },
    {
      code: '1402',
      name: 'JUPECHIMANA',
    },
    {
      code: '1403',
      name: 'JURRASQUERRAMANA',
    },
    {
      code: '1404',
      name: 'JUTSETKAT',
    },
    {
      code: '1405',
      name: 'KAICHONS',
    },
    {
      code: '1406',
      name: 'KAIKAISHI',
    },
    {
      code: '1407',
      name: 'KAIMAKAT',
    },
    {
      code: '1408',
      name: 'KANALASUMANA',
    },
    {
      code: '1409',
      name: 'KANNILLAMANA',
    },
    {
      code: '1410',
      name: 'KAPUCHIRRUMANA',
    },
    {
      code: '1411',
      name: 'KARSILLAMANA',
    },
    {
      code: '1412',
      name: 'KASIRRAINSUMANA',
    },
    {
      code: '1413',
      name: 'KATAWALECHON',
    },
    {
      code: '1414',
      name: 'KAUSARIJUNA',
    },
    {
      code: '1415',
      name: 'KAYUSKIMANA',
    },
    {
      code: '1416',
      name: 'KECAMANA',
    },
    {
      code: '1417',
      name: 'KEICIRA',
    },
    {
      code: '1418',
      name: 'KEMOU',
    },
    {
      code: '1419',
      name: 'KOUSHIMANA',
    },
    {
      code: '1420',
      name: 'KOUSHOTCHON',
    },
    {
      code: '1421',
      name: 'KUASHAMANA',
    },
    {
      code: '1422',
      name: 'KULII',
    },
    {
      code: '1423',
      name: 'KURIYAMANA',
    },
    {
      code: '1424',
      name: 'KUSHKAT',
    },
    {
      code: '1425',
      name: 'LA CRUZ',
    },
    {
      code: '1426',
      name: 'LA LOMA',
    },
    {
      code: '1427',
      name: 'LA SIERRA',
    },
    {
      code: '1428',
      name: 'LACANTAMANA',
    },
    {
      code: '1429',
      name: 'LAGUNITA',
    },
    {
      code: '1430',
      name: 'LAMATAMANA',
    },
    {
      code: '1431',
      name: 'LAPUNTACHON',
    },
    {
      code: '1432',
      name: 'LOMA DE JOTOLIMANA',
    },
    {
      code: '1433',
      name: 'LOMAMATO',
    },
    {
      code: '1434',
      name: 'LOS MANANTIALES',
    },
    {
      code: '1435',
      name: 'MAIMA JASAY',
    },
    {
      code: '1436',
      name: 'MAJALY',
    },
    {
      code: '1437',
      name: 'MAJUAMANA',
    },
    {
      code: '1438',
      name: 'MALANQUE',
    },
    {
      code: '1439',
      name: 'MAMON',
    },
    {
      code: '1440',
      name: 'MANIATURE',
    },
    {
      code: '1441',
      name: 'MANYOHI',
    },
    {
      code: '1442',
      name: 'MAPUAY',
    },
    {
      code: '1443',
      name: 'MAPUIN',
    },
    {
      code: '1444',
      name: 'MARANAMANA',
    },
    {
      code: '1445',
      name: 'MARRAJAKIMANA',
    },
    {
      code: '1446',
      name: 'MARRAYONMANA',
    },
    {
      code: '1447',
      name: 'MASHEISHAKAT',
    },
    {
      code: '1448',
      name: 'MAJAYURA',
    },
    {
      code: '1449',
      name: 'MASHOU',
    },
    {
      code: '1450',
      name: 'MASHOU II',
    },
    {
      code: '1451',
      name: 'MAUIMANA',
    },
    {
      code: '1452',
      name: 'MAYABANGLOMA',
    },
    {
      code: '1453',
      name: 'MAYONAMANA',
    },
    {
      code: '1454',
      name: 'MEXICO',
    },
    {
      code: '1455',
      name: 'MICHAJAURIA',
    },
    {
      code: '1456',
      name: 'MOLUMANA',
    },
    {
      code: '1457',
      name: 'MONTEP',
    },
    {
      code: '1458',
      name: 'MONTEREY',
    },
    {
      code: '1459',
      name: 'MURALEN (SECTOR MUSICHI)',
    },
    {
      code: '1460',
      name: 'MURRALEIN',
    },
    {
      code: '1461',
      name: 'MUSPULE',
    },
    {
      code: '1462',
      name: 'NALAP',
    },
    {
      code: '1463',
      name: 'NAMUNICHY',
    },
    {
      code: '1464',
      name: 'NAUNASHITON',
    },
    {
      code: '1465',
      name: 'NAWAMANA',
    },
    {
      code: '1466',
      name: 'NEIMA',
    },
    {
      code: '1467',
      name: 'NUEVA ESPERANZA',
    },
    {
      code: '1468',
      name: 'OLONIKIOU',
    },
    {
      code: '1469',
      name: 'ONOLOULIA',
    },
    {
      code: '1470',
      name: 'OPOTUNEKA',
    },
    {
      code: '1471',
      name: 'OURULLA',
    },
    {
      code: '1472',
      name: 'PACHAMANA',
    },
    {
      code: '1473',
      name: 'PAKIMANA',
    },
    {
      code: '1474',
      name: 'PALASHUMANA',
    },
    {
      code: '1475',
      name: 'PALIAWOU',
    },
    {
      code: '1476',
      name: 'PANERRACAT',
    },
    {
      code: '1477',
      name: 'PASUA',
    },
    {
      code: '1478',
      name: 'PATAJAMANA',
    },
    {
      code: '1479',
      name: 'PATAJATAMANA',
    },
    {
      code: '1480',
      name: 'PATARRIAL',
    },
    {
      code: '1481',
      name: 'PAZ MANY',
    },
    {
      code: '1482',
      name: 'PED-TUNAY',
    },
    {
      code: '1483',
      name: 'PERRACHON',
    },
    {
      code: '1484',
      name: 'PERRAGITA',
    },
    {
      code: '1485',
      name: 'PERRATPU',
    },
    {
      code: '1486',
      name: 'PESUAPA',
    },
    {
      code: '1487',
      name: 'PETD TUNAY',
    },
    {
      code: '1488',
      name: 'PIR RIP',
    },
    {
      code: '1489',
      name: 'PIRRUAITAKAT',
    },
    {
      code: '1490',
      name: 'PLOTCHON',
    },
    {
      code: '1491',
      name: 'POLUMALETKAT',
    },
    {
      code: '1492',
      name: 'PONCHERRAMANA',
    },
    {
      code: '1493',
      name: 'PONDORE',
    },
    {
      code: '1494',
      name: 'POPOSHICAT',
    },
    {
      code: '1495',
      name: 'POPOSHIMANA',
    },
    {
      code: '1496',
      name: 'PROVINCIAL',
    },
    {
      code: '1497',
      name: 'PUIPULEIN',
    },
    {
      code: '1498',
      name: 'PUIPUREN',
    },
    {
      code: '1499',
      name: 'PULUTSIRRA',
    },
    {
      code: '1500',
      name: 'PURIKUMANA',
    },
    {
      code: '1501',
      name: 'QUEICHON',
    },
    {
      code: '1502',
      name: 'RAFAEL BARROS BONIVENTO',
    },
    {
      code: '1503',
      name: 'RATIT',
    },
    {
      code: '1504',
      name: 'RLIPUMANA',
    },
    {
      code: '1505',
      name: 'RUCAIN',
    },
    {
      code: '1506',
      name: 'RULEYA NO.2',
    },
    {
      code: '1507',
      name: 'SABANACHON',
    },
    {
      code: '1508',
      name: 'SAMARIA No. 2',
    },
    {
      code: '1509',
      name: 'SAN FRANCISCO',
    },
    {
      code: '1510',
      name: 'SANTA ANA',
    },
    {
      code: '1511',
      name: 'SANTA CRUZ',
    },
    {
      code: '1512',
      name: 'SANTA LUCIA',
    },
    {
      code: '1513',
      name: 'SANTA MARIA',
    },
    {
      code: '1514',
      name: 'SANTALENA',
    },
    {
      code: '1515',
      name: 'SARRALAUT',
    },
    {
      code: '1516',
      name: 'SARRUTPIEN',
    },
    {
      code: '1517',
      name: 'SARUTSIRA',
    },
    {
      code: '1518',
      name: 'SEGUANA',
    },
    {
      code: '1519',
      name: 'SHICHEN',
    },
    {
      code: '1520',
      name: 'SHIRRAIN',
    },
    {
      code: '1521',
      name: 'SHISCHON',
    },
    {
      code: '1522',
      name: 'SHOPONOTCAT',
    },
    {
      code: '1523',
      name: 'SHOSHICA',
    },
    {
      code: '1524',
      name: 'SHULUITA',
    },
    {
      code: '1525',
      name: 'SIERRITA',
    },
    {
      code: '1526',
      name: 'SIRIA',
    },
    {
      code: '1527',
      name: 'SIRRUMATSHI',
    },
    {
      code: '1528',
      name: 'SOLDADO PARATE BIEN',
    },
    {
      code: '1529',
      name: 'SOULOTH',
    },
    {
      code: '1530',
      name: 'SPATOU',
    },
    {
      code: '1531',
      name: 'SUCURRUTPIA',
    },
    {
      code: '1532',
      name: 'SUKURRUTPIA',
    },
    {
      code: '1533',
      name: 'TEQUIA No. 1',
    },
    {
      code: '1534',
      name: 'TOLINCHEN',
    },
    {
      code: '1535',
      name: 'TOTOPUNA',
    },
    {
      code: '1536',
      name: 'TUCTU',
    },
    {
      code: '1537',
      name: 'TUKURAKA',
    },
    {
      code: '1538',
      name: 'TUWAPALAA',
    },
    {
      code: '1539',
      name: 'ULIANAMANA',
    },
    {
      code: '1540',
      name: 'ULPAO',
    },
    {
      code: '1541',
      name: 'UNAAPUCHON',
    },
    {
      code: '1542',
      name: 'UNIAKAT',
    },
    {
      code: '1543',
      name: 'UNAAPÃœCHON',
    },
    {
      code: '1544',
      name: 'AL JOTE',
    },
    {
      code: '1545',
      name: 'UNION LIMONAL',
    },
    {
      code: '1546',
      name: 'URIYUNAKAT',
    },
    {
      code: '1547',
      name: 'WAIRAMANA',
    },
    {
      code: '1548',
      name: 'WAISHITPANA (CACHACA 1)',
    },
    {
      code: '1549',
      name: 'WAMAYAU',
    },
    {
      code: '1550',
      name: 'WARA WARAO',
    },
    {
      code: '1551',
      name: 'WARIPOU',
    },
    {
      code: '1552',
      name: 'WARRARAM',
    },
    {
      code: '1553',
      name: 'WARRUTTAIN',
    },
    {
      code: '1554',
      name: 'WASHINGTON',
    },
    {
      code: '1555',
      name: 'WATCHUAPA',
    },
    {
      code: '1556',
      name: 'WAYETAKAT',
    },
    {
      code: '1557',
      name: 'WAYMANA',
    },
    {
      code: '1558',
      name: 'WAYUUPIA',
    },
    {
      code: '1559',
      name: 'WOUKUCTO',
    },
    {
      code: '1560',
      name: 'WOYOTOMANA',
    },
    {
      code: '1561',
      name: 'WUNUPARAT',
    },
    {
      code: '1562',
      name: 'YAMULIKAMANA',
    },
    {
      code: '1563',
      name: 'YARETSCAY',
    },
    {
      code: '1564',
      name: 'YAWACIRU',
    },
    {
      code: '1565',
      name: 'YAWOULIA',
    },
    {
      code: '1566',
      name: 'YAWOULIPAA',
    },
    {
      code: '1567',
      name: 'YOJOKIMANA',
    },
    {
      code: '1568',
      name: 'YOSURU',
    },
    {
      code: '1569',
      name: 'YOSUUMANA',
    },
    {
      code: '1570',
      name: 'YOULETSHI',
    },
    {
      code: '1571',
      name: 'YOUNLETSHI',
    },
    {
      code: '1572',
      name: 'YOURANACHON',
    },
    {
      code: '1573',
      name: 'YOUREPU',
    },
    {
      code: '1574',
      name: 'YUTADSHI',
    },
    {
      code: '1575',
      name: 'ZARRULUAMANA',
    },
    {
      code: '1576',
      name: 'HIOTSHY',
    },
    {
      code: '1577',
      name: 'BARRANCO COLORADO',
    },
    {
      code: '1578',
      name: 'BARRANCO CEIBA Y LAGUNA ARAGUATO',
    },
    {
      code: '1579',
      name: 'BARRANQUILLITA',
    },
    {
      code: '1580',
      name: 'CACHIVERA DE NARE',
    },
    {
      code: '1581',
      name: 'CANO NEGRO',
    },
    {
      code: '1582',
      name: 'CENTRO MIRAFLORES',
    },
    {
      code: '1583',
      name: 'COROCORO',
    },
    {
      code: '1584',
      name: 'EL ITILLA',
    },
    {
      code: '1585',
      name: 'EL REFUGIO',
    },
    {
      code: '1586',
      name: 'LA ASUNCION',
    },
    {
      code: '1587',
      name: 'LA FUGA',
    },
    {
      code: '1588',
      name: 'LA YUQUERA',
    },
    {
      code: '1589',
      name: 'LAGOS EL DORADO',
    },
    {
      code: '1590',
      name: 'MORICHAL VIEJO',
    },
    {
      code: '1591',
      name: 'NUKAK MAKU',
    },
    {
      code: '1592',
      name: 'PTO.VIEJO Y PTO ESPERANZA',
    },
    {
      code: '1593',
      name: 'PUERTO NARE',
    },
    {
      code: '1594',
      name: 'TUCAN DE CANO GIRIZA Y PUERTO LA PALMA',
    },
    {
      code: '1595',
      name: 'VENEZUELA O PANURE',
    },
    {
      code: '1596',
      name: 'VUELTA DEL ALIVIO',
    },
    {
      code: '1597',
      name: 'PUERTO MONFORT',
    },
    {
      code: '1598',
      name: 'YAVILLA II',
    },
    {
      code: '1599',
      name: 'BACHE',
    },
    {
      code: '1600',
      name: 'PIJAO EL VERGEL',
    },
    {
      code: '1601',
      name: 'LA ESTACION TALAGA',
    },
    {
      code: '1602',
      name: 'LA REFORMA',
    },
    {
      code: '1603',
      name: 'LA TATACOA',
    },
    {
      code: '1604',
      name: 'LLANO BUCO - BUKJ UKUE',
    },
    {
      code: '1605',
      name: 'NAM MISAK',
    },
    {
      code: '1606',
      name: 'NUEVO AMANECER LA MESETA',
    },
    {
      code: '1607',
      name: 'PIC KUE IKH (LAGUNA DEL CACIQUE JUAN TAMA)',
    },
    {
      code: '1608',
      name: 'RUMIYACO',
    },
    {
      code: '1609',
      name: 'SAN AGUSTIN',
    },
    {
      code: '1610',
      name: 'TAMA-PAEZ LA GABRIELA',
    },
    {
      code: '1611',
      name: 'TAMAS DEL CAGUAN (dujos paniquita)',
    },
    {
      code: '1612',
      name: 'SANTA BARBARA PIJAO',
    },
    {
      code: '1613',
      name: 'ARHUACO DE LA SIERRA NEVADA',
    },
    {
      code: '1614',
      name: 'CHiMILA DE SAN ANGEL (ISSA ORISTUNA)',
    },
    {
      code: '1615',
      name: 'KOGUI-MALAYO-ARHUACO',
    },
    {
      code: '1616',
      name: 'EL TIGRE',
    },
    {
      code: '1617',
      name: 'IWIWI',
    },
    {
      code: '1618',
      name: 'VENCEDOR-PIRIRI GUAMITO Y MATANEGRA',
    },
    {
      code: '1619',
      name: 'WALIANI',
    },
    {
      code: '1620',
      name: 'COROCITO - YOPALITO-WACOYO',
    },
    {
      code: '1621',
      name: 'ALTO UNUMA',
    },
    {
      code: '1622',
      name: 'CANO JABON',
    },
    {
      code: '1623',
      name: 'CANO OVEJAS (BETANIA-COROCITO)',
    },
    {
      code: '1624',
      name: 'CHARCO CAIMAN',
    },
    {
      code: '1625',
      name: 'COROZAL TAPAOJO',
    },
    {
      code: '1626',
      name: 'DOMO PLANAS',
    },
    {
      code: '1627',
      name: 'DOQUERA',
    },
    {
      code: '1628',
      name: 'EL TURPIAL',
    },
    {
      code: '1629',
      name: 'EL TURPIAL',
    },
    {
      code: '1630',
      name: 'LA VICTORIA',
    },
    {
      code: '1631',
      name: 'LA JULIA',
    },
    {
      code: '1632',
      name: 'LA SAL',
    },
    {
      code: '1633',
      name: 'LOS PLANES',
    },
    {
      code: '1634',
      name: 'MACUARE',
    },
    {
      code: '1635',
      name: 'MAGUARE',
    },
    {
      code: '1636',
      name: 'ONDAS DEL CAFRE',
    },
    {
      code: '1637',
      name: 'VILLA LUCIA',
    },
    {
      code: '1638',
      name: 'ALDEA DE MARIA',
    },
    {
      code: '1639',
      name: 'ALTO ALBI',
    },
    {
      code: '1640',
      name: 'ALTO CARTAGENA',
    },
    {
      code: '1641',
      name: 'APONTE',
    },
    {
      code: '1642',
      name: 'CARLOSAMA',
    },
    {
      code: '1643',
      name: 'CHAGUI',
    },
    {
      code: '1644',
      name: 'CHILES',
    },
    {
      code: '1645',
      name: 'CHINGUIRITO MIRA',
    },
    {
      code: '1646',
      name: 'COLIMBA',
    },
    {
      code: '1647',
      name: 'CUAMBI-YASLAMBI',
    },
    {
      code: '1648',
      name: 'CUASBIL-LA FALDADA',
    },
    {
      code: '1649',
      name: 'CUASCUABI-PALDUBI',
    },
    {
      code: '1650',
      name: 'CUCHILLA PALMAR',
    },
    {
      code: '1651',
      name: 'PALMAR DE IMBI',
    },
    {
      code: '1652',
      name: 'PIALAPI-PUEBLO VIEJO SAN MIGUEL - YARE',
    },
    {
      code: '1653',
      name: 'PINGULLO- SARDINERO',
    },
    {
      code: '1654',
      name: 'RAMOS-MONGON MANCHURIA',
    },
    {
      code: '1655',
      name: 'GUALCALA',
    },
    {
      code: '1656',
      name: 'CUAIQUER INTEGRADO LA MILAGROSA',
    },
    {
      code: '1657',
      name: 'CUMBAL',
    },
    {
      code: '1658',
      name: 'EL CEDRO',
    },
    {
      code: '1659',
      name: 'EL GRAN SABALO',
    },
    {
      code: '1660',
      name: 'EL SANDE',
    },
    {
      code: '1661',
      name: 'GUACHAVEZ',
    },
    {
      code: '1662',
      name: 'GUACHUCAL',
    },
    {
      code: '1663',
      name: 'GUADUAL-CUMBAS-MAGUI-IMBINA-ARRAYAN',
    },
    {
      code: '1664',
      name: 'GUELMAMBI-CARANO',
    },
    {
      code: '1665',
      name: 'HONDA RIO GUIZA',
    },
    {
      code: '1666',
      name: 'INDA ZABALETA',
    },
    {
      code: '1667',
      name: 'MAIZ BLANCO',
    },
    {
      code: '1668',
      name: 'MORRITO',
    },
    {
      code: '1669',
      name: 'INTEGRADO DEL CHARCO',
    },
    {
      code: '1670',
      name: 'IPIALES',
    },
    {
      code: '1671',
      name: 'KEJUAMBI FELICIANA',
    },
    {
      code: '1672',
      name: 'SANQUIANGUITA',
    },
    {
      code: '1673',
      name: 'LA FLORESTA-SANTA ROSA - SAN FRANCISCO',
    },
    {
      code: '1674',
      name: 'LA TURBIA',
    },
    {
      code: '1675',
      name: 'MALES',
    },
    {
      code: '1676',
      name: 'MALLAMA',
    },
    {
      code: '1677',
      name: 'MAYASQUER',
    },
    {
      code: '1678',
      name: 'MIRAFLORES DE INCHUCHALA (INCHUCHALA MIRAFLORES)',
    },
    {
      code: '1679',
      name: 'MUELLAMUES',
    },
    {
      code: '1680',
      name: 'MUESES',
    },
    {
      code: '1681',
      name: 'NULPE MEDIO-ALTO RIO SAN JUAN',
    },
    {
      code: '1682',
      name: 'NULPE MEDIO-ALTO RIO SAN JUAN',
    },
    {
      code: '1683',
      name: 'NUNALBI ALTO ULBI',
    },
    {
      code: '1684',
      name: 'PANAN',
    },
    {
      code: '1685',
      name: 'PASTAS',
    },
    {
      code: '1686',
      name: 'PIEDRA SELLADA QUEBRADA TRONQUERA',
    },
    {
      code: '1687',
      name: 'PIGUAMBI PALANGALA',
    },
    {
      code: '1688',
      name: 'PIPALTA-PALBI YAGUAPI',
    },
    {
      code: '1689',
      name: 'PLANADAS DE TELEMBI',
    },
    {
      code: '1690',
      name: 'PULGANDE CAMPOALEGRE',
    },
    {
      code: '1691',
      name: 'QUEBRADA GRANDE',
    },
    {
      code: '1692',
      name: 'REFUGIO DEL SOL',
    },
    {
      code: '1693',
      name: 'RIO SATINGA',
    },
    {
      code: '1694',
      name: 'RIO SATINGA',
    },
    {
      code: '1695',
      name: 'SAN AGUSTIN LA FLORESTA',
    },
    {
      code: '1696',
      name: 'SAN JUAN',
    },
    {
      code: '1697',
      name: 'SAN JUAN DEL PAMPON',
    },
    {
      code: '1698',
      name: 'SAUNDE GUIGUAY',
    },
    {
      code: '1699',
      name: 'SANTA ROSA DE SUCUMBIOS EL DIVISO',
    },
    {
      code: '1700',
      name: 'TORTUGANA. TELEMBI',
    },
    {
      code: '1701',
      name: 'TRONQUERIA',
    },
    {
      code: '1702',
      name: 'TUQUERRES',
    },
    {
      code: '1703',
      name: 'UKUMARI KANKHE',
    },
    {
      code: '1704',
      name: 'YARAMAL',
    },
    {
      code: '1705',
      name: 'YASCUAL',
    },
    {
      code: '1706',
      name: 'LA LAGUNA',
    },
    {
      code: '1707',
      name: 'GABARRA CATALAURA',
    },
    {
      code: '1708',
      name: 'IROCOBINGCAYRA',
    },
    {
      code: '1709',
      name: 'MOTILON BARI',
    },
    {
      code: '1710',
      name: 'SOPACAYRA',
    },
    {
      code: '1711',
      name: 'ALBANIA',
    },
    {
      code: '1712',
      name: 'ALPAMANGA',
    },
    {
      code: '1713',
      name: 'ALTO LORENZO (KIWNAS CXHAB)',
    },
    {
      code: '1714',
      name: 'ALTO ORITO',
    },
    {
      code: '1715',
      name: 'BELLAVISTA-(MISMO BAJO BELLAVISTA)',
    },
    {
      code: '1716',
      name: 'BLASIAKU',
    },
    {
      code: '1717',
      name: 'CAICEDONIA',
    },
    {
      code: '1718',
      name: 'CALARCA',
    },
    {
      code: '1719',
      name: 'CALENTURAS',
    },
    {
      code: '1720',
      name: 'CAMENTSA BIYA',
    },
    {
      code: '1721',
      name: 'CAMPOALEGRE DEL AFILADOR',
    },
    {
      code: '1722',
      name: 'CANAVERAL',
    },
    {
      code: '1723',
      name: 'CECILIA COCHA',
    },
    {
      code: '1724',
      name: 'CHALUAYACO',
    },
    {
      code: '1725',
      name: 'CONDAGUA',
    },
    {
      code: '1726',
      name: 'CONSARA-MECAYA',
    },
    {
      code: '1727',
      name: 'CRISTALINA II',
    },
    {
      code: '1728',
      name: 'DAMASCO VIDES',
    },
    {
      code: '1729',
      name: 'EL DESCANSO',
    },
    {
      code: '1730',
      name: 'EL ESPINGO',
    },
    {
      code: '1731',
      name: 'EL HACHA',
    },
    {
      code: '1732',
      name: 'EL PORVENIR LA BARRIALOSA',
    },
    {
      code: '1733',
      name: 'EL PROGRESO',
    },
    {
      code: '1734',
      name: 'EL TABLERO',
    },
    {
      code: '1735',
      name: 'INGA DE MOCOA',
    },
    {
      code: '1736',
      name: 'INGA KAMSA DE MOCOA',
    },
    {
      code: '1737',
      name: 'JIRIJIRI',
    },
    {
      code: '1738',
      name: 'LA AGUADITA',
    },
    {
      code: '1739',
      name: 'LA ARGELIA',
    },
    {
      code: '1740',
      name: 'LA CRISTALINA',
    },
    {
      code: '1741',
      name: 'LA FLORIDA',
    },
    {
      code: '1742',
      name: 'LA ITALIA',
    },
    {
      code: '1743',
      name: 'LA PAYA',
    },
    {
      code: '1744',
      name: 'TUKUNARE',
    },
    {
      code: '1745',
      name: 'LAGARTO COCHA',
    },
    {
      code: '1746',
      name: 'LOS GUADUALES',
    },
    {
      code: '1747',
      name: 'SANTA RITA',
    },
    {
      code: '1748',
      name: 'NUEVO HORIZONTE',
    },
    {
      code: '1749',
      name: 'SIBUNDOY PARTE ALTA (KAMÃ‹NTSÃ BIYÃ DE SIBUNDOY CAMBIA DE NOMBRE POR LA AMPLIACION)',
    },
    {
      code: '1750',
      name: 'PIEDRA SAGRADA LA GRAN FAMILIA DE LOS PASTOS',
    },
    {
      code: '1751',
      name: 'PREDIO PUTUMAYO',
    },
    {
      code: '1752',
      name: 'PUERTO LIMON',
    },
    {
      code: '1753',
      name: 'WASIPUNGO',
    },
    {
      code: '1754',
      name: 'SAN ANDRES',
    },
    {
      code: '1755',
      name: 'SAN JOSE (ANTES DESCANSE)',
    },
    {
      code: '1756',
      name: 'SAN MIGUEL DE LA CASTELLANA',
    },
    {
      code: '1757',
      name: 'JERUSALEN -SAN LUIS- ALTO PICUDITO',
    },
    {
      code: '1758',
      name: 'SANTA CRUZ DE PINUNA BLANCO',
    },
    {
      code: '1759',
      name: 'SANTA ROSA DE JUANAMBU',
    },
    {
      code: '1760',
      name: 'SANTA ROSA DEL GUAMUEZ',
    },
    {
      code: '1761',
      name: 'SELVA VERDE',
    },
    {
      code: '1762',
      name: 'SIMORNA O LA VENADA',
    },
    {
      code: '1763',
      name: 'TIERRA LINDA (KIWE ZXICXKWE)',
    },
    {
      code: '1764',
      name: 'VALLE DE SIBUNDOY DE ORIGEN COLONIAL',
    },
    {
      code: '1765',
      name: 'INGA DE COLON',
    },
    {
      code: '1766',
      name: 'SIONA VEGAS DE SANTANA',
    },
    {
      code: '1767',
      name: 'VILLA CATALINA DE PUERTO ROSARIO',
    },
    {
      code: '1768',
      name: 'VILLANUEVA',
    },
    {
      code: '1769',
      name: 'VILLARICA',
    },
    {
      code: '1770',
      name: 'WASIPANGA',
    },
    {
      code: '1771',
      name: 'YARINAL-SAN MARCELINO',
    },
    {
      code: '1772',
      name: 'YUNGUILLO',
    },
    {
      code: '1773',
      name: 'AWA SEVILLA',
    },
    {
      code: '1774',
      name: 'ALTO COMBOY',
    },
    {
      code: '1775',
      name: 'INGA DE SAN PEDRO',
    },
    {
      code: '1776',
      name: 'CAMINEMCHA DEL QUINDIO',
    },
    {
      code: '1777',
      name: 'ALTOMIRA',
    },
    {
      code: '1778',
      name: 'COMUNIDAD EMBERA CHAMI',
    },
    {
      code: '1779',
      name: 'FLOR DEL MONTE',
    },
    {
      code: '1780',
      name: 'GITÃ“ DOCABÃš',
    },
    {
      code: '1781',
      name: 'LA LOMA DE CITABARA PALESTINA ATARRAYA Y LA ALBANIA',
    },
    {
      code: '1782',
      name: 'MARGENES DERECHA E IZQUIERDA RIO SAN JUAN (UNIFICADO)',
    },
    {
      code: '1783',
      name: 'SURATENA',
    },
    {
      code: '1784',
      name: 'KARAMBA',
    },
    {
      code: '1785',
      name: 'BELLAVISTA',
    },
    {
      code: '1786',
      name: 'CARACOL',
    },
    {
      code: '1787',
      name: 'CAYO DE LA CRUZ',
    },
    {
      code: '1788',
      name: 'CIENAGUITA',
    },
    {
      code: '1789',
      name: 'CUIVA-CANO VIEJO',
    },
    {
      code: '1790',
      name: 'EL OASIS',
    },
    {
      code: '1791',
      name: 'GUALON',
    },
    {
      code: '1792',
      name: 'ISLA GALLINAZO',
    },
    {
      code: '1793',
      name: 'LA PALMIRA',
    },
    {
      code: '1794',
      name: 'LA PICHE',
    },
    {
      code: '1795',
      name: 'LA UNION FLORESTA',
    },
    {
      code: '1796',
      name: 'LA VENTA LA ESPERANZA',
    },
    {
      code: '1797',
      name: 'LAS CAVERNAS',
    },
    {
      code: '1798',
      name: 'LAS PIEDRAS',
    },
    {
      code: '1799',
      name: 'LOS ALTOS',
    },
    {
      code: '1800',
      name: 'MAMEY',
    },
    {
      code: '1801',
      name: 'MANICA',
    },
    {
      code: '1802',
      name: 'QUEVEVA',
    },
    {
      code: '1803',
      name: 'REPARO',
    },
    {
      code: '1804',
      name: 'SAN ANTONIO URBANO',
    },
    {
      code: '1805',
      name: 'SAN MARTIN',
    },
    {
      code: '1806',
      name: 'SANTO DOMINGO VIDAL',
    },
    {
      code: '1807',
      name: 'SILOE',
    },
    {
      code: '1808',
      name: 'TORRENTE',
    },
    {
      code: '1809',
      name: 'UNION CANITO',
    },
    {
      code: '1810',
      name: 'VARSOVIA',
    },
    {
      code: '1811',
      name: 'ACEVEDO Y GOMEZ',
    },
    {
      code: '1812',
      name: 'ACO VIEJO',
    },
    {
      code: '1813',
      name: 'AICO',
    },
    {
      code: '1814',
      name: 'ANABA',
    },
    {
      code: '1815',
      name: 'ANACARCO',
    },
    {
      code: '1816',
      name: 'BALOCA',
    },
    {
      code: '1817',
      name: 'BALSILLAS',
    },
    {
      code: '1818',
      name: 'BALSILLAS (CORREG.BALSILLAS)',
    },
    {
      code: '1819',
      name: 'BALSILLAS LIMON',
    },
    {
      code: '1820',
      name: 'BANDERAS',
    },
    {
      code: '1821',
      name: 'BARBACOAS',
    },
    {
      code: '1822',
      name: 'BARZALOZA',
    },
    {
      code: '1823',
      name: 'BATEAS',
    },
    {
      code: '1824',
      name: 'BELTRAN',
    },
    {
      code: '1825',
      name: 'BOCAS DE HILARCO',
    },
    {
      code: '1826',
      name: 'BOCAS DEL TETUAN',
    },
    {
      code: '1827',
      name: 'BUENAVISTA MECHE',
    },
    {
      code: '1828',
      name: 'CALAPENA',
    },
    {
      code: '1829',
      name: 'CALARA SAN MARTIN',
    },
    {
      code: '1830',
      name: 'CAMINO REAL',
    },
    {
      code: '1831',
      name: 'CAMPOALEGRE',
    },
    {
      code: '1832',
      name: 'CANALY VENTA QUEMADA',
    },
    {
      code: '1833',
      name: 'CASTILLA ANGOSTURAS',
    },
    {
      code: '1834',
      name: 'CASTILLA ANONALES',
    },
    {
      code: '1835',
      name: 'CHAQUIRA',
    },
    {
      code: '1836',
      name: 'CHENCHE AGUA FRIA',
    },
    {
      code: '1837',
      name: 'CHENCHE AMAYARCO',
    },
    {
      code: '1838',
      name: 'CHENCHE ASOLEADOS',
    },
    {
      code: '1839',
      name: 'CHENCHE ASOLEADOS- EL VERGEL',
    },
    {
      code: '1840',
      name: 'CHENCHE BALSILLAS',
    },
    {
      code: '1841',
      name: 'CHENCHE BUENAVISTA',
    },
    {
      code: '1842',
      name: 'CHENCHE BUENOS AIRES INDEPENDIENTE',
    },
    {
      code: '1843',
      name: 'CHENCHE BUENOS AIRES TRADICIONAL',
    },
    {
      code: '1844',
      name: 'CHENCHE MEDIA LUNA',
    },
    {
      code: '1845',
      name: 'CHENCHE SOCORRO LOS GUAYABOS',
    },
    {
      code: '1846',
      name: 'CHENCHE TUNARCO',
    },
    {
      code: '1847',
      name: 'CHENCHE ZARAGOZA',
    },
    {
      code: '1848',
      name: 'CUCHARO SAN ANTONIO',
    },
    {
      code: '1849',
      name: 'CHICUAMBE LAS BRISAS',
    },
    {
      code: '1850',
      name: 'CHIQUINIMA',
    },
    {
      code: '1851',
      name: 'CHORRILLO',
    },
    {
      code: '1852',
      name: 'COCANA',
    },
    {
      code: '1853',
      name: 'COLOYA',
    },
    {
      code: '1854',
      name: 'COYARCO',
    },
    {
      code: '1855',
      name: 'DIAMANTE',
    },
    {
      code: '1856',
      name: 'DOYARE CENTRO',
    },
    {
      code: '1857',
      name: 'DOYARE PORVENIR',
    },
    {
      code: '1858',
      name: 'DOYARE RECRISTO',
    },
    {
      code: '1859',
      name: 'EL FLORAL',
    },
    {
      code: '1860',
      name: 'EL FLORAL TRADICIONAL',
    },
    {
      code: '1861',
      name: 'EL VERGEL',
    },
    {
      code: '1862',
      name: 'ESPINALITO',
    },
    {
      code: '1863',
      name: 'GUADUALEJAS',
    },
    {
      code: '1864',
      name: 'GUAIPA CENTRO',
    },
    {
      code: '1865',
      name: 'GUAIPA UNO',
    },
    {
      code: '1866',
      name: 'GUALERAS',
    },
    {
      code: '1867',
      name: 'GUASIMAL',
    },
    {
      code: '1868',
      name: 'GUATAVITA TUA',
    },
    {
      code: '1869',
      name: 'GUAVIO FLAUTILLO',
    },
    {
      code: '1870',
      name: 'GUAYAQUIL',
    },
    {
      code: '1871',
      name: 'GUAYAQUIL LOS PIJAOS',
    },
    {
      code: '1872',
      name: 'HILARQUITO',
    },
    {
      code: '1873',
      name: 'ICO VALLE DE ANAPE',
    },
    {
      code: '1874',
      name: 'IMBA',
    },
    {
      code: '1875',
      name: 'JABALCON',
    },
    {
      code: '1876',
      name: 'KILOKA PLAYA VERDE',
    },
    {
      code: '1877',
      name: 'LA CHONTA EL CHIRCAL',
    },
    {
      code: '1878',
      name: 'LA FLECHA ALTOZANO',
    },
    {
      code: '1879',
      name: 'LA SALINA',
    },
    {
      code: '1880',
      name: 'LA SORTIJA',
    },
    {
      code: '1881',
      name: 'LA TUTIRA BONANZA',
    },
    {
      code: '1882',
      name: 'LAS PALMAS',
    },
    {
      code: '1883',
      name: 'LLOVEDERO',
    },
    {
      code: '1884',
      name: 'LOMAS DE GUAGUARCO',
    },
    {
      code: '1885',
      name: 'LOMAS DE HILARCO',
    },
    {
      code: '1886',
      name: 'LOMAS MESA DE SAN JUAN',
    },
    {
      code: '1887',
      name: 'LOS ANGELES',
    },
    {
      code: '1888',
      name: 'MECHE SAN CAYETANO',
    },
    {
      code: '1889',
      name: 'MERCADILLO',
    },
    {
      code: '1890',
      name: 'MESA DE CUCUANA ACEITUNO',
    },
    {
      code: '1891',
      name: 'MESA DE CUCUANA SANTA RITA',
    },
    {
      code: '1892',
      name: 'MESA DE ORTEGA',
    },
    {
      code: '1893',
      name: 'MESAS DE SAN JUAN',
    },
    {
      code: '1894',
      name: 'MESAS DE INCA',
    },
    {
      code: '1895',
      name: 'MESONES',
    },
    {
      code: '1896',
      name: 'MONTEFRIO',
    },
    {
      code: '1897',
      name: 'NANURCO',
    },
    {
      code: '1898',
      name: 'NATACOY PIJAO',
    },
    {
      code: '1899',
      name: 'NATAIMA',
    },
    {
      code: '1900',
      name: 'NATAROCO',
    },
    {
      code: '1901',
      name: 'NICOLAS RAMIREZ',
    },
    {
      code: '1902',
      name: 'OLIRCO',
    },
    {
      code: '1903',
      name: 'PACANDE',
    },
    {
      code: '1904',
      name: 'PAEZ DE GAITANIA',
    },
    {
      code: '1905',
      name: 'PALERMO',
    },
    {
      code: '1906',
      name: 'PALMA ALTA',
    },
    {
      code: '1907',
      name: 'PALMAR BOCAS DE BABI',
    },
    {
      code: '1908',
      name: 'PALONEGRO',
    },
    {
      code: '1909',
      name: 'PASOANCHO',
    },
    {
      code: '1910',
      name: 'POCARA',
    },
    {
      code: '1911',
      name: 'POCHARCO',
    },
    {
      code: '1912',
      name: 'POTRERITO-DOYARE',
    },
    {
      code: '1913',
      name: 'PUEBLO VIEJO DE SANTA RITA LA MINA',
    },
    {
      code: '1914',
      name: 'PUERTO SAMARIA',
    },
    {
      code: '1915',
      name: 'QUEBRADITAS',
    },
    {
      code: '1916',
      name: 'QUINTIN LAME LOS COLORADOS',
    },
    {
      code: '1917',
      name: 'RECINTO PALMAROSA',
    },
    {
      code: '1918',
      name: 'RINCON BODEGA',
    },
    {
      code: '1919',
      name: 'RINCON DE ANCHIQUE',
    },
    {
      code: '1920',
      name: 'RINCON VELU',
    },
    {
      code: '1921',
      name: 'ROSARIO',
    },
    {
      code: '1922',
      name: 'PALMIRA ALTA',
    },
    {
      code: '1923',
      name: 'SAN ANTONIO DE CALARMA',
    },
    {
      code: '1924',
      name: 'SAN DIEGO',
    },
    {
      code: '1925',
      name: 'SAN MIGUEL',
    },
    {
      code: '1926',
      name: 'SANTA BARBARA',
    },
    {
      code: '1927',
      name: 'SANTA MARTA DIAMANTE',
    },
    {
      code: '1928',
      name: 'SANTA MARTA INSPECCION',
    },
    {
      code: '1929',
      name: 'SANTA MARTA PALMAR',
    },
    {
      code: '1930',
      name: 'SOCORCO',
    },
    {
      code: '1931',
      name: 'TAMIRCO',
    },
    {
      code: '1932',
      name: 'TINAJAS',
    },
    {
      code: '1933',
      name: 'TOTARCO - NIPLE',
    },
    {
      code: '1934',
      name: 'TOTARCO DINDE TRADICIONAL',
    },
    {
      code: '1935',
      name: 'TOTARCO DINDE INDEPENDIENTE',
    },
    {
      code: '1936',
      name: 'TOTARCO TAMARINDO',
    },
    {
      code: '1937',
      name: 'TOTARCO-PIEDRAS',
    },
    {
      code: '1938',
      name: 'TRES ESQUINAS',
    },
    {
      code: '1939',
      name: 'VELU CENTRO',
    },
    {
      code: '1940',
      name: 'VINOLLANOGRANDE',
    },
    {
      code: '1941',
      name: 'VUELTA DEL RIO',
    },
    {
      code: '1942',
      name: 'YABERCO',
    },
    {
      code: '1943',
      name: 'YACO MOLANA',
    },
    {
      code: '1944',
      name: 'YAGUARA',
    },
    {
      code: '1945',
      name: 'YAVI',
    },
    {
      code: '1946',
      name: 'ZANJA HONDA',
    },
    {
      code: '1947',
      name: 'ZARAGOZA - TAMARINDO',
    },
    {
      code: '1948',
      name: 'CACIQUE YAIMA',
    },
    {
      code: '1949',
      name: 'KALARKA',
    },
    {
      code: '1950',
      name: 'LA UNION',
    },
    {
      code: '1951',
      name: 'PIJAO DE ORO',
    },
    {
      code: '1952',
      name: 'GUAGUARCO PALMAROSA',
    },
    {
      code: '1953',
      name: 'CHENCHE ANGOSTURA',
    },
    {
      code: '1954',
      name: 'AIMA',
    },
    {
      code: '1955',
      name: 'EL PALMAR',
    },
    {
      code: '1956',
      name: 'YABERCO LOS LAGOS',
    },
    {
      code: '1957',
      name: 'CHACHAJO',
    },
    {
      code: '1958',
      name: 'CHONARA HUENA',
    },
    {
      code: '1959',
      name: 'GUAYACAN SANTA ROSA',
    },
    {
      code: '1960',
      name: 'RIO DAGUA(LA MESETA)',
    },
    {
      code: '1961',
      name: 'EPERARA SIAPIDARA DEL RIO NAYA',
    },
    {
      code: '1962',
      name: 'EMBERA EPERARA DEL RIO NAYA',
    },
    {
      code: '1963',
      name: 'NASA EMBERA CHAMI LA DELFINA',
    },
    {
      code: '1964',
      name: 'CENTRAL DE ASENTAMIENTOS INDIGENAS( KWESX YU KIWE)',
    },
    {
      code: '1965',
      name: 'BAJO CACERES (KIPARA)',
    },
    {
      code: '1966',
      name: 'BATATAL O RIO GARRAPATAS',
    },
    {
      code: '1967',
      name: 'SAN QUININI',
    },
    {
      code: '1968',
      name: 'CUENCA DEL RIO GUABAS',
    },
    {
      code: '1969',
      name: 'CUEVA LOCA',
    },
    {
      code: '1970',
      name: 'DACHI DRUA',
    },
    {
      code: '1971',
      name: 'DACHI DRUA MUNDI',
    },
    {
      code: '1972',
      name: 'DOXURA',
    },
    {
      code: '1973',
      name: 'DRUA DO ( PORTALES DEL RIO)',
    },
    {
      code: '1974',
      name: 'EL MACHETAZO Y EL CHUZO (HOY KIMA DRUA)',
    },
    {
      code: '1975',
      name: 'GUASIRUMA',
    },
    {
      code: '1976',
      name: 'KWES KIWE NASA',
    },
    {
      code: '1977',
      name: 'KWET WALA (PIEDRA GRANDE)',
    },
    {
      code: '1978',
      name: 'KWET WALA',
    },
    {
      code: '1979',
      name: 'LOS NIASA',
    },
    {
      code: '1980',
      name: 'NABERA DRUA',
    },
    {
      code: '1981',
      name: 'NASA KWEÂ´S KIWE',
    },
    {
      code: '1982',
      name: 'NASA THÃ',
    },
    {
      code: '1983',
      name: 'PAILA ARRIBA (HOY DANA DRUA)',
    },
    {
      code: '1984',
      name: 'TAPARO VERSALLES (HOY DACHI DANA-LA DORADA)',
    },
    {
      code: '1985',
      name: 'TRIUNFO CRISTAL PAEZ',
    },
    {
      code: '1986',
      name: 'VALLEDUPAR',
    },
    {
      code: '1987',
      name: 'VANIA CHAMI DE ARGELIA',
    },
    {
      code: '1988',
      name: 'YU YIK KWE',
    },
    {
      code: '1989',
      name: 'JOOIN JEB',
    },
    {
      code: '1990',
      name: 'COCALITO',
    },
    {
      code: '1991',
      name: 'CACHICAMO',
    },
    {
      code: '1992',
      name: 'CALI-BARRANQUILLA',
    },
    {
      code: '1993',
      name: 'CAMPOALEGRE Y RIPIALITO',
    },
    {
      code: '1994',
      name: 'CANO BACHACO',
    },
    {
      code: '1995',
      name: 'CANO GUARIPA',
    },
    {
      code: '1996',
      name: 'CANO LA HORMIGA',
    },
    {
      code: '1997',
      name: 'CANO MESETAS - DAGUA Y MURCIELAGO',
    },
    {
      code: '1998',
      name: 'CANO CHOCON',
    },
    {
      code: '1999',
      name: 'CHOLOLOBO MATATU',
    },
    {
      code: '2000',
      name: 'EGUA-GUARIACANA',
    },
    {
      code: '2001',
      name: 'FLORES SOMBRERO',
    },
    {
      code: '2002',
      name: 'GUACAMAYAS MAIPORE',
    },
    {
      code: '2003',
      name: 'GUACAMAYAS MAMIYARE',
    },
    {
      code: '2004',
      name: 'KAWANERUBA',
    },
    {
      code: '2005',
      name: 'LA ESMERALDA',
    },
    {
      code: '2006',
      name: 'LA LLANURA',
    },
    {
      code: '2007',
      name: 'LA PASCUA',
    },
    {
      code: '2008',
      name: 'MEREY',
    },
    {
      code: '2009',
      name: 'MUCO MAYORAGUA',
    },
    {
      code: '2010',
      name: 'NUEVA ESPERANZA DEL TOMO',
    },
    {
      code: '2011',
      name: 'PUNTA BANDERA',
    },
    {
      code: '2012',
      name: 'RIO SIARE',
    },
    {
      code: '2013',
      name: 'RIOS MUCO Y GUARROJO',
    },
    {
      code: '2014',
      name: 'RIOS TOMO Y WEBERI',
    },
    {
      code: '2015',
      name: 'SAN LUIS DEL TOMO',
    },
    {
      code: '2016',
      name: 'SANTA ROSALIA',
    },
    {
      code: '2017',
      name: 'SANTA TERESITA DEL TUPARRO',
    },
    {
      code: '2018',
      name: 'SARACURE Y RIO CADA',
    },
    {
      code: '2019',
      name: 'SELVA DE MATAVEN - BARRANQUITO LAGUNA COLORADA',
    },
    {
      code: '2020',
      name: 'SELVA DE MATAVEN - BERROCAL AJOTA',
    },
    {
      code: '2021',
      name: 'SELVA DE MATAVEN - CANOS CUNA TSEPAJIVO-WARRACANA',
    },
    {
      code: '2022',
      name: 'SELVA DE MATAVEN - CUMARAL BRAZO AMANAVEN',
    },
    {
      code: '2023',
      name: 'SELVA DE MATAVEN - GIRO',
    },
    {
      code: '2024',
      name: 'SELVA DE MATAVEN - YURI',
    },
    {
      code: '2025',
      name: 'SELVA DE MATAVEN -(SEJALITO-SAN BENITO)',
    },
    {
      code: '2026',
      name: 'SELVA DE MATAVEN -ATANA PIRARIAMI',
    },
    {
      code: '2027',
      name: 'SELVA DE MATAVEN -BAJO RIO VICHADA',
    },
    {
      code: '2028',
      name: 'SELVA DE MATAVEN -CANO BOCON',
    },
    {
      code: '2029',
      name: 'SELVA DE MATAVEN -CANO CAVASI',
    },
    {
      code: '2030',
      name: 'SELVA DE MATAVEN -CANO ZAMA',
    },
    {
      code: '2031',
      name: 'SELVA DE MATAVEN- LAGUNA ANGUILLA LA MACARENA',
    },
    {
      code: '2032',
      name: 'SELVA DE MATAVEN -LAGUNA NEGRA Y CACAO',
    },
    {
      code: '2033',
      name: 'SELVA DE MATAVEN -MATAVEN - FRUTA',
    },
    {
      code: '2034',
      name: 'SELVA DE MATAVEN -MOROCOTO -BUENAVISTA-MANAJUARE',
    },
    {
      code: '2035',
      name: 'VALDIVIA',
    },
    {
      code: '2036',
      name: 'MISAK DE SAN ANTONIO',
    },
    {
      code: '2037',
      name: 'YU CXIJME',
    },
    {
      code: '2038',
      name: 'EL MAMON',
    },
    {
      code: '2039',
      name: 'PUENTE URE',
    },
    {
      code: '2040',
      name: 'ILES',
    },
    {
      code: '2041',
      name: 'MARUZA',
    },
    {
      code: '2042',
      name: 'MONTEGRANDE',
    },
    {
      code: '2043',
      name: 'LA TRINA',
    },
    {
      code: '2044',
      name: 'FUNES',
    },
    {
      code: '2045',
      name: 'VILLA MARIA DE ANAMU',
    },
    {
      code: '2046',
      name: 'YASHAY WASY',
    },
    {
      code: '2047',
      name: 'JUIN PHUBUUR',
    },
    {
      code: '2048',
      name: 'ALMENDRO',
    },
    {
      code: '2049',
      name: 'LOMA DE PIEDRA',
    },
    {
      code: '2050',
      name: 'PROVIDENCIA',
    },
    {
      code: '2051',
      name: 'JENOY',
    },
    {
      code: '2052',
      name: 'TAMA CANALI',
    },
    {
      code: '2053',
      name: 'VERGEL CALARMA',
    },
    {
      code: '2054',
      name: 'ALTO SINAI',
    },
    {
      code: '2055',
      name: 'PURISIMA',
    },
    {
      code: '2056',
      name: 'VILUT',
    },
    {
      code: '2057',
      name: 'GALAPA',
    },
    {
      code: '2058',
      name: 'SAN JOSE DE ALMAGRA',
    },
    {
      code: '2059',
      name: 'AMBIWASI',
    },
    {
      code: '2060',
      name: 'NUKANCHIPA ALPA',
    },
    {
      code: '2061',
      name: 'SANTA CLARA DE TARAPOTO',
    },
    {
      code: '2062',
      name: 'LA SUCIA',
    },
    {
      code: '2063',
      name: 'VOLCAN AGUA FLORIDA',
    },
    {
      code: '2064',
      name: 'VARASANTA-PUERTO NUEVO',
    },
    {
      code: '2065',
      name: 'TUGURIDO-KARRIZAL',
    },
    {
      code: '2066',
      name: 'MATECANDELA',
    },
    {
      code: '2067',
      name: 'PLAYAS DE BOJABA',
    },
    {
      code: '2068',
      name: 'JULIEROS Y VELASQUEROS',
    },
    {
      code: '2069',
      name: 'AGUA NEGRA',
    },
    {
      code: '2070',
      name: 'GEGENADO',
    },
    {
      code: '2071',
      name: 'EL DIECIOCHO',
    },
    {
      code: '2072',
      name: 'LAS TOLDAS',
    },
    {
      code: '2073',
      name: 'MUCHIDO',
    },
    {
      code: '2074',
      name: 'URBANO DE SAN ANDRES DE SOTAVENTO',
    },
    {
      code: '2075',
      name: 'ALTA RIVERA ROMA',
    },
    {
      code: '2076',
      name: 'BAJO NORTE',
    },
    {
      code: '2077',
      name: 'BAJO PALMITAL',
    },
    {
      code: '2078',
      name: 'EL BRILLANTE NORTE',
    },
    {
      code: '2079',
      name: 'CALLE LARGA',
    },
    {
      code: '2080',
      name: 'CONTENTO',
    },
    {
      code: '2081',
      name: 'EL BANCO',
    },
    {
      code: '2082',
      name: 'EL PEINE',
    },
    {
      code: '2083',
      name: 'LOS GAVIRIA',
    },
    {
      code: '2084',
      name: 'PALMAS VERDES',
    },
    {
      code: '2085',
      name: 'PALMITO SUR',
    },
    {
      code: '2086',
      name: 'PATIO BONITO NORTE',
    },
    {
      code: '2087',
      name: 'PATIO BONITO SUR',
    },
    {
      code: '2088',
      name: 'PLAZA BONITA',
    },
    {
      code: '2089',
      name: 'BELLA VISTA',
    },
    {
      code: '2090',
      name: 'CALLE DEL MEDIO',
    },
    {
      code: '2091',
      name: 'CARRETAL',
    },
    {
      code: '2092',
      name: 'CASTILLERAL',
    },
    {
      code: '2093',
      name: 'CERRO DE PAJA',
    },
    {
      code: '2094',
      name: 'CRUZ CHIQUITA',
    },
    {
      code: '2095',
      name: 'EL PINAL',
    },
    {
      code: '2096',
      name: 'LOVERAN',
    },
    {
      code: '2097',
      name: 'MATA DE CANA',
    },
    {
      code: '2098',
      name: 'NUEVA ESTACION',
    },
    {
      code: '2099',
      name: 'NUEVA ESTRELLA',
    },
    {
      code: '2100',
      name: 'SABANA COSTA',
    },
    {
      code: '2101',
      name: 'ALANAIPA',
    },
    {
      code: '2102',
      name: 'ACHOCHOJOLEKAT',
    },
    {
      code: '2103',
      name: 'AIMANA',
    },
    {
      code: '2104',
      name: 'ALAMACHON',
    },
    {
      code: '2105',
      name: 'ALESPOULIA',
    },
    {
      code: '2106',
      name: 'ALICHAHAURIA',
    },
    {
      code: '2107',
      name: 'MERIDAILY',
    },
    {
      code: '2108',
      name: 'PORVENIR (KILOMETRO 17)',
    },
    {
      code: '2109',
      name: 'PUERTO CHENTICO',
    },
    {
      code: '2110',
      name: 'PUNTA SIERRA',
    },
    {
      code: '2111',
      name: 'SALACAR',
    },
    {
      code: '2112',
      name: 'SOLOVITA (KILOMETRO 7 MARGEN DERECHO VIA VALLEDUPAR)',
    },
    {
      code: '2113',
      name: 'TOCOROMANA (BOCA DE CAMARONES)',
    },
    {
      code: '2114',
      name: 'TOKOROMANA',
    },
    {
      code: '2115',
      name: 'MURRAY',
    },
    {
      code: '2116',
      name: 'OCHO PALMA',
    },
    {
      code: '2117',
      name: 'PAZ PILON',
    },
    {
      code: '2118',
      name: 'MARIANGOLA',
    },
    {
      code: '2119',
      name: 'MOCHOMANA',
    },
    {
      code: '2120',
      name: 'LEGENA',
    },
    {
      code: '2121',
      name: 'LOMA FRESCA (WAWATAMANA)',
    },
    {
      code: '2122',
      name: 'LOS ATICOS',
    },
    {
      code: '2123',
      name: 'LOS CABRITOS',
    },
    {
      code: '2124',
      name: 'LOS CITHUELOS',
    },
    {
      code: '2125',
      name: 'LOS COCOS',
    },
    {
      code: '2126',
      name: 'MACOYA',
    },
    {
      code: '2127',
      name: 'ARRALIA EL AHUMAO 2',
    },
    {
      code: '2128',
      name: 'BUENA VISTA',
    },
    {
      code: '2129',
      name: 'BUENO MONTE',
    },
    {
      code: '2130',
      name: 'CARI CARI',
    },
    {
      code: '2131',
      name: 'CERRO PERALTA',
    },
    {
      code: '2132',
      name: 'CUEVEJENTA',
    },
    {
      code: '2133',
      name: 'EL AHUMAO',
    },
    {
      code: '2134',
      name: 'EL ARROYO',
    },
    {
      code: '2135',
      name: 'EL COLORADO',
    },
    {
      code: '2136',
      name: 'EL ESTERO',
    },
    {
      code: '2137',
      name: 'EL PARAISO',
    },
    {
      code: '2138',
      name: 'EL PATRON',
    },
    {
      code: '2139',
      name: 'EL PRINCIPIO',
    },
    {
      code: '2140',
      name: 'GUAJIRITO',
    },
    {
      code: '2141',
      name: 'GUAYABAL',
    },
    {
      code: '2142',
      name: 'GUAYABITAL',
    },
    {
      code: '2143',
      name: 'GUAYACANAL',
    },
    {
      code: '2144',
      name: 'IRRUKANALY',
    },
    {
      code: '2145',
      name: 'JAMICHIMANA',
    },
    {
      code: '2146',
      name: 'JARIJIMANA',
    },
    {
      code: '2147',
      name: 'JARIJINAMANA',
    },
    {
      code: '2148',
      name: 'JULIAN PEREZ',
    },
    {
      code: '2149',
      name: 'KAMUCHESAIN',
    },
    {
      code: '2150',
      name: 'KAPOOS (CACHACA 2)',
    },
    {
      code: '2151',
      name: 'KIOKIOMANA',
    },
    {
      code: '2152',
      name: 'KUCHARAMANA',
    },
    {
      code: '2153',
      name: 'LA MACOLLA',
    },
    {
      code: '2154',
      name: 'LA PLAZOLETA',
    },
    {
      code: '2155',
      name: 'LA SABANA',
    },
    {
      code: '2156',
      name: 'LA TOLDA',
    },
    {
      code: '2157',
      name: 'FIW PAEZ',
    },
    {
      code: '2158',
      name: 'PALMAR DE LOS CRIOLLOS',
    },
    {
      code: '2159',
      name: 'WITACKWE',
    },
    {
      code: '2160',
      name: 'NASA CHAMB',
    },
    {
      code: '2161',
      name: 'GRAN ROSARIO',
    },
    {
      code: '2162',
      name: 'GRAN RIOSARIO',
    },
    {
      code: '2163',
      name: 'BOBOQUIRA',
    },
    {
      code: '2164',
      name: 'ISHTODA',
    },
    {
      code: '2165',
      name: 'AGUABLANCA',
    },
    {
      code: '2166',
      name: 'ALTO TEMBLON',
    },
    {
      code: '2167',
      name: 'BOCANAS DE LUZON',
    },
    {
      code: '2168',
      name: 'DOS QUEBRADAS',
    },
    {
      code: '2169',
      name: 'CANA BRAVITA',
    },
    {
      code: '2170',
      name: 'EL DANUBIO - NASA KWUMA TEWESX',
    },
    {
      code: '2171',
      name: 'EL RUBY (INKAL AWA)',
    },
    {
      code: '2172',
      name: 'BAJO SANTA HELENA',
    },
    {
      code: '2173',
      name: 'LA LIBERTAD (NASA FXIW KSXAW WALA)',
    },
    {
      code: '2174',
      name: 'LAS MINAS',
    },
    {
      code: '2175',
      name: 'PLAYA RICA',
    },
    {
      code: '2176',
      name: 'BAJO CASACUNTE',
    },
    {
      code: '2177',
      name: 'BAJO REMANSO',
    },
    {
      code: '2178',
      name: 'LA PERECERA',
    },
    {
      code: '2179',
      name: 'NASSA KIWE',
    },
    {
      code: '2180',
      name: 'NUEVA ISLA',
    },
    {
      code: '2181',
      name: 'NUEVA PALESTINA (NASA KIWE USE)',
    },
    {
      code: '2182',
      name: 'PALMERAS',
    },
    {
      code: '2183',
      name: 'ALPARUMIYACO',
    },
    {
      code: '2184',
      name: 'MUSU WAIRA SACHA NUCANCHIPA',
    },
    {
      code: '2185',
      name: 'SALADILLOIACO',
    },
    {
      code: '2186',
      name: 'EL BARSAL',
    },
    {
      code: '2187',
      name: 'LA GRAN VIA',
    },
    {
      code: '2188',
      name: 'MEDIA SOMBRA',
    },
    {
      code: '2189',
      name: 'BOSSA NAVARRO',
    },
    {
      code: '2190',
      name: 'GUAIMARO',
    },
    {
      code: '2191',
      name: 'CAMPO LAS MIRELLAS',
    },
    {
      code: '2192',
      name: 'CERRITO DE LA PALMA',
    },
    {
      code: '2193',
      name: 'LA GALLERA',
    },
    {
      code: '2194',
      name: 'LAS FLORES LA GALLERA',
    },
    {
      code: '2195',
      name: 'LOMA DE TIGRE BUENOS AIRES',
    },
    {
      code: '2196',
      name: 'CERRITO BONGO',
    },
    {
      code: '2197',
      name: 'LA PLAYA ALTO NAYA',
    },
    {
      code: '2198',
      name: 'VEINTE DE JULIO',
    },
    {
      code: '2199',
      name: 'PATRULLERO',
    },
    {
      code: '2200',
      name: 'VALENCIA',
    },
    {
      code: '2201',
      name: 'PUERTO ESPERANZA',
    },
    {
      code: '2202',
      name: '7 DE AGOSTO',
    },
    {
      code: '2203',
      name: 'VILLA ANDREA',
    },
    {
      code: '2204',
      name: 'SANTA TERESITA',
    },
    {
      code: '2205',
      name: 'NUEVO PARAISO',
    },
    {
      code: '2206',
      name: 'COMERCIO',
    },
    {
      code: '2207',
      name: '8 DE DICIEMBRE',
    },
    {
      code: '2208',
      name: 'LOS BAOS',
    },
    {
      code: '2209',
      name: 'LOMA LINDA',
    },
    {
      code: '2210',
      name: '13 DE MAYO',
    },
    {
      code: '2211',
      name: 'PITULIMANA I',
    },
    {
      code: '2212',
      name: 'PITULIMANA II',
    },
    {
      code: '2213',
      name: 'BEKOCHA GUAJIRA',
    },
    {
      code: '2214',
      name: 'MISAK PISCITAU',
    },
    {
      code: '2215',
      name: 'PENA LA ALEGRIA',
    },
    {
      code: '2216',
      name: 'INDA GUACARAY',
    },
    {
      code: '2217',
      name: 'EL SILENCIO',
    },
    {
      code: '2218',
      name: 'AMBA PATADO',
    },
    {
      code: '2219',
      name: 'RIO NAYA',
    },
    {
      code: '2220',
      name: 'YAPOROGOS TAIRA',
    },
    {
      code: '2221',
      name: 'CANDILEJAS',
    },
    {
      code: '2222',
      name: 'ALTO SUSPIZACHA',
    },
    {
      code: '2223',
      name: 'MUSURRUNACUNA',
    },
    {
      code: '2224',
      name: 'CAUCAPAPUNGO-FLORESTA',
    },
    {
      code: '2225',
      name: 'YACUAS DE PALESTINA',
    },
    {
      code: '2226',
      name: 'POTRERITO SAN MARTIN',
    },
    {
      code: '2227',
      name: 'RIONEGRO HERMOSAS',
    },
    {
      code: '2228',
      name: 'CIMARRONA ALTA',
    },
    {
      code: '2229',
      name: 'EL ESCOBAL',
    },
    {
      code: '2230',
      name: 'AMOYA LA VIRGINIA',
    },
    {
      code: '2231',
      name: 'LAME PAEZ ORGANOS EL PALMAR',
    },
    {
      code: '2232',
      name: 'SEK FIW PAEZ',
    },
    {
      code: '2233',
      name: 'RINCON DE CANALI',
    },
    {
      code: '2234',
      name: 'TAQUIMA',
    },
    {
      code: '2235',
      name: 'LULUMOY',
    },
    {
      code: '2236',
      name: 'CAJON DE MACULE',
    },
    {
      code: '2237',
      name: 'CEDRALES PERALONSO',
    },
    {
      code: '2238',
      name: 'CHAPINERO LOANY TOY',
    },
    {
      code: '2239',
      name: 'PIJAOS LOS LAURELES',
    },
    {
      code: '2240',
      name: 'LUCERITO ALTO',
    },
    {
      code: '2241',
      name: 'MACO CALARMA',
    },
    {
      code: '2242',
      name: 'CAMPO BELLO AWA',
    },
    {
      code: '2243',
      name: 'TSSENENE',
    },
    {
      code: '2244',
      name: 'EL ROSAL',
    },
    {
      code: '2245',
      name: 'INTILLAGTA HIJOS DEL SOL',
    },
    {
      code: '2246',
      name: 'ANSEA',
    },
    {
      code: '2247',
      name: 'LA SOLEDAD',
    },
    {
      code: '2248',
      name: 'EL FIERA',
    },
    {
      code: '2249',
      name: 'NUKANCHIPA IUKASKA',
    },
    {
      code: '2250',
      name: 'TENTEYA',
    },
    {
      code: '2251',
      name: 'CRUCITA LA VIRGINIA',
    },
    {
      code: '2252',
      name: 'LA LUISA',
    },
    {
      code: '2253',
      name: 'PUERTA DEL MACIZO',
    },
    {
      code: '2254',
      name: 'CABECERA MUNICIPAL',
    },
    {
      code: '2255',
      name: 'LA CABANA',
    },
    {
      code: '2256',
      name: 'CERRO TIJERAS',
    },
    {
      code: '2257',
      name: 'LUSITANIA',
    },
    {
      code: '2258',
      name: 'JULUMITO',
    },
    {
      code: '2259',
      name: 'CAMPO BELLO PASTOS',
    },
    {
      code: '2260',
      name: 'SACHA WAGRA',
    },
    {
      code: '2261',
      name: 'LA CAMPANA',
    },
    {
      code: '2262',
      name: 'ALTO NAPO RUNA',
    },
    {
      code: '2263',
      name: 'MONEIDE JITOMA',
    },
    {
      code: '2264',
      name: 'GUANAPAIMANA',
    },
    {
      code: '2265',
      name: 'KALETINSUMANA',
    },
    {
      code: '2266',
      name: 'CORAL',
    },
    {
      code: '2267',
      name: 'CEMENTAMANA',
    },
    {
      code: '2268',
      name: 'PUWAIMANA',
    },
    {
      code: '2269',
      name: 'PANAMA',
    },
    {
      code: '2270',
      name: 'PIJAOS DE CUNIRCO',
    },
    {
      code: '2271',
      name: 'PALO ALTO',
    },
    {
      code: '2272',
      name: 'BERRUGAS',
    },
    {
      code: '2273',
      name: 'EL ROSARIO DE PLAZA BONITA',
    },
    {
      code: '2274',
      name: 'EL REDENTOR DEL MARANONAL',
    },
    {
      code: '2275',
      name: 'SAN JUAN DE DIOS DE LAS PELONAS',
    },
    {
      code: '2276',
      name: 'RAICES DE ORIENTE',
    },
    {
      code: '2277',
      name: 'COFRADIA',
    },
    {
      code: '2278',
      name: 'GRAN PUTUMAYO',
    },
    {
      code: '2279',
      name: 'SAN JOSE DEL PEPINO',
    },
    {
      code: '2280',
      name: 'LA PAZ',
    },
    {
      code: '2281',
      name: 'LOS ALMENDROS',
    },
    {
      code: '2282',
      name: 'PLAYA LARGA',
    },
    {
      code: '2283',
      name: 'SANTA ROSITA',
    },
    {
      code: '2284',
      name: 'DACHI AGORE DRUA (ES LA MISMA COMUNIDAD EMBERA CHAMI CAMNEMCHA DEL QUINDIO)',
    },
    {
      code: '2285',
      name: 'KURAK CHAK',
    },
    {
      code: '2286',
      name: 'POLICARPA',
    },
    {
      code: '2287',
      name: 'CRUZ DEL BEQUE',
    },
    {
      code: '2288',
      name: 'MAISHESHE LA CHIVERA',
    },
    {
      code: '2289',
      name: 'TATACHIO MIRABEL',
    },
    {
      code: '2290',
      name: 'VALLES DEL MAGDALENA',
    },
    {
      code: '2291',
      name: 'YAPOROGOS',
    },
    {
      code: '2292',
      name: 'LA GRANJITA',
    },
    {
      code: '2293',
      name: 'LAS DELICIAS (KIWE NXUSXA)',
    },
    {
      code: '2294',
      name: 'SAUCES DE GUAYABAL',
    },
    {
      code: '2295',
      name: 'MONTEBELLO',
    },
    {
      code: '2296',
      name: 'BAJO CHUSPIZACHA',
    },
    {
      code: '2297',
      name: 'LOS POIMAS',
    },
    {
      code: '2298',
      name: 'POINCOS TAIRA',
    },
    {
      code: '2299',
      name: 'KWE',
    },
    {
      code: '2300',
      name: 'LAS HUERTAS',
    },
    {
      code: '2301',
      name: 'SABANAS DEL POTRERO',
    },
    {
      code: '2302',
      name: 'CANA BRAVA',
    },
    {
      code: '2303',
      name: 'KASISKA',
    },
    {
      code: '2304',
      name: 'WAMAYAO',
    },
    {
      code: '2305',
      name: 'TOLOMANA',
    },
    {
      code: '2306',
      name: 'KERAKAR',
    },
    {
      code: '2307',
      name: 'PANSENOR',
    },
    {
      code: '2308',
      name: 'SABANAS DE LA NEGRA',
    },
    {
      code: '2309',
      name: 'HUERTAS CHICAS ARRIBA',
    },
    {
      code: '2310',
      name: 'HUERTAS CHICAS',
    },
    {
      code: '2311',
      name: 'PIEDRAS BLANCAS',
    },
    {
      code: '2312',
      name: 'CERRO GUADUA',
    },
    {
      code: '2313',
      name: 'SAN JOSE',
    },
    {
      code: '2314',
      name: 'CAMPO HERRERA',
    },
    {
      code: '2315',
      name: 'CARRETAMANA',
    },
    {
      code: '2316',
      name: 'LUHOPU',
    },
    {
      code: '2317',
      name: 'PANCHO MANA',
    },
    {
      code: '2318',
      name: 'HORQUETA',
    },
    {
      code: '2319',
      name: 'MUSURUNAKUNA',
    },
    {
      code: '2320',
      name: 'PUERTO VIEJO',
    },
    {
      code: '2321',
      name: 'RINCON DEL MAR',
    },
    {
      code: '2322',
      name: 'ISMUINA',
    },
    {
      code: '2323',
      name: 'TIOSILIDIO',
    },
    {
      code: '2324',
      name: 'QUACHOQUERO',
    },
    {
      code: '2325',
      name: 'LOS REMEDIOS',
    },
    {
      code: '2326',
      name: 'JOTE',
    },
    {
      code: '2327',
      name: 'DIVIDIVI',
    },
    {
      code: '2328',
      name: 'PARAISO',
    },
    {
      code: '2329',
      name: 'APUNIMANA',
    },
    {
      code: '2330',
      name: 'CACTUS',
    },
    {
      code: '2331',
      name: 'POLOSIWARRA',
    },
    {
      code: '2332',
      name: 'SOL DE LOS PASTOS',
    },
    {
      code: '2333',
      name: 'CARTAMA',
    },
    {
      code: '2334',
      name: 'ALTOPLANO SAN ANTONIO',
    },
    {
      code: '2335',
      name: 'LA PENATA',
    },
    {
      code: '2336',
      name: 'CAFÃ‰ PISAO',
    },
    {
      code: '2337',
      name: 'EBANO TACANAL',
    },
    {
      code: '2338',
      name: 'UITIBOC',
    },
    {
      code: '2339',
      name: 'SANTA INES',
    },
    {
      code: '2340',
      name: 'LOS MANGOS',
    },
    {
      code: '2341',
      name: 'AGUA BLANCA',
    },
    {
      code: '2342',
      name: 'NASA UH',
    },
    {
      code: '2343',
      name: 'ISHU AWA',
    },
    {
      code: '2344',
      name: 'PAJONAL',
    },
    {
      code: '2345',
      name: 'LA LIBERTAD',
    },
    {
      code: '2346',
      name: 'SAN CARLOS',
    },
    {
      code: '2347',
      name: 'EL MANGO',
    },
    {
      code: '2348',
      name: 'BOCAS DE PALMITA',
    },
    {
      code: '2349',
      name: 'GUARNI IMA',
    },
    {
      code: '2350',
      name: 'CXHAB WALA LUUCX (BELLO HORIZONTE)',
    },
    {
      code: '2351',
      name: 'UKWE KIWE -LAS DELICIAS',
    },
    {
      code: '2352',
      name: 'CARI CARI 2',
    },
    {
      code: '2353',
      name: 'ARARAIPA',
    },
    {
      code: '2354',
      name: 'LANTAKII',
    },
    {
      code: '2355',
      name: 'YOULECHON',
    },
    {
      code: '2356',
      name: 'SABANA JUAN Y MEDIO',
    },
    {
      code: '2357',
      name: 'ALEWA LOS MONOS',
    },
    {
      code: '2358',
      name: 'JIRRAWAIKAT',
    },
    {
      code: '2359',
      name: 'PUERTO PACHECO',
    },
    {
      code: '2360',
      name: 'SAGECITO',
    },
    {
      code: '2361',
      name: 'GALILEA',
    },
    {
      code: '2362',
      name: 'BETANIA',
    },
    {
      code: '2363',
      name: 'MACOLLA SECTOR 1',
    },
    {
      code: '2364',
      name: 'EL JOPE',
    },
    {
      code: '2365',
      name: 'CAIRONARE',
    },
    {
      code: '2366',
      name: 'BUENOS AIRES',
    },
    {
      code: '2367',
      name: 'CACHACA 1 SECTOR PLAYA',
    },
    {
      code: '2368',
      name: 'EL PUY',
    },
    {
      code: '2369',
      name: 'CACHACA 2-PAINWASHI',
    },
    {
      code: '2370',
      name: 'TRES MARIAS',
    },
    {
      code: '2371',
      name: 'MARTIN ROQUEME',
    },
    {
      code: '2372',
      name: 'TUCHINCITO',
    },
    {
      code: '2373',
      name: 'TEVIS',
    },
    {
      code: '2374',
      name: 'PUNTA VERDE',
    },
    {
      code: '2375',
      name: 'KSXAW NASA',
    },
    {
      code: '2376',
      name: 'MONILLA AMENA',
    },
    {
      code: '2377',
      name: 'INTI YAKU',
    },
    {
      code: '2378',
      name: 'AWALIBA',
    },
    {
      code: '2379',
      name: 'PUEBLO KOKONUKO DE POPAYAN',
    },
    {
      code: '2380',
      name: 'LA NUEVA ESPERANZA',
    },
    {
      code: '2381',
      name: 'NUKANCHIPA LLAKTA',
    },
    {
      code: '2382',
      name: 'PUERTO RICO',
    },
    {
      code: '2383',
      name: 'BRISAS DE ATA',
    },
    {
      code: '2384',
      name: 'MESA DE POLE',
    },
    {
      code: '2385',
      name: 'PUTUMAYO LAGUNA FLOR',
    },
    {
      code: '2386',
      name: 'PASTOS ORO VERDE',
    },
    {
      code: '2387',
      name: 'UNION MATOSO',
    },
    {
      code: '2388',
      name: 'BELLAVISTA Y UNION PITALITO',
    },
    {
      code: '2389',
      name: 'PUERTO CHICHILIANO',
    },
    {
      code: '2390',
      name: 'AYWJAWASHI EL JORDAN',
    },
    {
      code: '2391',
      name: 'SINAI ALTO NAYA',
    },
    {
      code: '2392',
      name: 'AIZAMA',
    },
    {
      code: '2393',
      name: 'ARARA-BACATI -CARURU Y LAGOS DE JAMAICURU',
    },
    {
      code: '2394',
      name: 'PARTE ORIENTAL DEL VAUPES',
    },
    {
      code: '2395',
      name: 'SAN VICTORINO',
    },
    {
      code: '2396',
      name: 'MULTIETNICA',
    },
    {
      code: '2397',
      name: 'BETE AURO DEL BUEY',
    },
    {
      code: '2398',
      name: 'EL MAIZAL',
    },
    {
      code: '2399',
      name: 'OLOKOMANA (OLOCOMANA)',
    },
    {
      code: '2400',
      name: 'FINZENU DE SAN SEBASTIAN',
    },
    {
      code: '2401',
      name: 'SAN NICOLAS DE BARI',
    },
    {
      code: '2402',
      name: 'EL BOLAO-LAS ESTANCIAS',
    },
    {
      code: '2403',
      name: 'NUEVO CAMPO ALEGRE',
    },
    {
      code: '2404',
      name: 'CATUFA',
    },
    {
      code: '2405',
      name: 'TOLAIMA',
    },
    {
      code: '2406',
      name: 'MATORA DE MAITO',
    },
    {
      code: '2407',
      name: 'YUMA',
    },
    {
      code: '2408',
      name: 'GRAN TESCUAL',
    },
    {
      code: '2409',
      name: 'EL CAMPANO DE LOS INDIOS',
    },
    {
      code: '2410',
      name: 'EL CARITO',
    },
    {
      code: '2411',
      name: 'LORICA ZENU VEREDA NUEVA ESPERANZA',
    },
    {
      code: '2412',
      name: 'NASA KWESX TATA WALA',
    },
    {
      code: '2413',
      name: 'NASA KIWE UKWE -TIERRA PLANA',
    },
    {
      code: '2414',
      name: 'NASA YUKHZXICXKWE -SELVA HERMOSA',
    },
    {
      code: '2415',
      name: 'NASA PKIND KIWE- -GUAYABALES',
    },
    {
      code: '2416',
      name: 'DIMAS OÂ´NEL MAJIN',
    },
    {
      code: '2417',
      name: 'AWA BRISAS DEL PALAY',
    },
    {
      code: '2418',
      name: 'KWESX NASA CXAÂ´YUCE-SAN JOSE',
    },
    {
      code: '2419',
      name: 'RAICERO',
    },
    {
      code: '2420',
      name: 'LOS ALGARROBOS',
    },
    {
      code: '2421',
      name: 'TERMOELECTRICA',
    },
    {
      code: '2422',
      name: 'SAN MATEO PAJONAL',
    },
    {
      code: '2423',
      name: 'SANTA ROSA',
    },
    {
      code: '2424',
      name: 'NUEVO ORIENTE',
    },
    {
      code: '2425',
      name: 'BECARPIGAR',
    },
    {
      code: '2426',
      name: 'NUEVO AMANECER MAME NAÂ´TA UMUGUSE',
    },
    {
      code: '2427',
      name: 'YUÂ´CEHK',
    },
    {
      code: '2428',
      name: 'APARCO',
    },
    {
      code: '2429',
      name: 'DOMO PLANAS',
    },
    {
      code: '2430',
      name: 'ETTE ENNAKA CHIMILA',
    },
    {
      code: '2431',
      name: 'CHOCHO',
    },
    {
      code: '2432',
      name: 'LA ESMERALDA DE COLOSO',
    },
    {
      code: '2433',
      name: 'BAJO OSTION',
    },
    {
      code: '2434',
      name: 'CORRAL DE SAN LUIS',
    },
    {
      code: '2435',
      name: 'MORRO HERMOSO',
    },
    {
      code: '2436',
      name: 'GUAIMARAL',
    },
    {
      code: '2437',
      name: 'JUARUCO',
    },
    {
      code: '2438',
      name: 'PUERTO CAIMAN',
    },
    {
      code: '2439',
      name: 'TUBARA',
    },
    {
      code: '2440',
      name: 'YANACONA DESCANSE',
    },
    {
      code: '2441',
      name: 'KICHWA DE SESQUILE',
    },
    {
      code: '2442',
      name: 'JEGÃœITA',
    },
    {
      code: '2443',
      name: 'TACASUAN',
    },
    {
      code: '2444',
      name: 'LOMAS DE PALITO',
    },
    {
      code: '2445',
      name: 'CHUPUNDUN',
    },
    {
      code: '2446',
      name: 'CENTRO AZUL',
    },
    {
      code: '2447',
      name: 'EL MARTILLO',
    },
    {
      code: '2448',
      name: 'SANTA CLARA',
    },
    {
      code: '2449',
      name: 'EL PORVENIR',
    },
    {
      code: '2450',
      name: 'LAS PALOMAS EL OLIVO',
    },
    {
      code: '2451',
      name: 'PISABONITO',
    },
    {
      code: '2452',
      name: 'NUEVA VIDA',
    },
    {
      code: '2453',
      name: 'PIJIGUAY',
    },
    {
      code: '2454',
      name: 'BELEN',
    },
    {
      code: '2455',
      name: 'EL CARMEN DE PETACA',
    },
    {
      code: '2456',
      name: 'EL BRILLANTE LA BALASTRERA',
    },
    {
      code: '2457',
      name: 'ANDES NORTE',
    },
    {
      code: '2458',
      name: 'GUAYACANES NORTE',
    },
    {
      code: '2459',
      name: 'EL ROBLE',
    },
    {
      code: '2460',
      name: 'CERRITO DEL TAMARINDO',
    },
    {
      code: '2461',
      name: 'LAS CRUCES',
    },
    {
      code: '2462',
      name: 'BUENOS AIRES NORTE EL CHUZO',
    },
    {
      code: '2463',
      name: 'ARAUCA',
    },
    {
      code: '2464',
      name: 'SANTO DOMINGO',
    },
    {
      code: '2465',
      name: 'MOMPOX',
    },
    {
      code: '2466',
      name: 'CARINITO',
    },
    {
      code: '2467',
      name: 'CUATRO VIENTOS',
    },
    {
      code: '2468',
      name: 'PLAZA BONITA CUATRO CAMINOS',
    },
    {
      code: '2469',
      name: 'SABANA NUEVA',
    },
    {
      code: '2470',
      name: 'SABANAL',
    },
    {
      code: '2471',
      name: 'MAJAGUAL',
    },
    {
      code: '2472',
      name: 'LAS PENITAS',
    },
    {
      code: '2473',
      name: 'TIERRA ALTICA',
    },
    {
      code: '2474',
      name: 'EL MANGUITO',
    },
    {
      code: '2475',
      name: 'NUEVO PARAISO LA BALASTRERA',
    },
    {
      code: '2476',
      name: 'CENTRO ALEGRE',
    },
    {
      code: '2477',
      name: 'SABANALARGA PALITO',
    },
    {
      code: '2478',
      name: 'COSTA DE ORO',
    },
    {
      code: '2479',
      name: 'EL CRUCERO',
    },
    {
      code: '2480',
      name: 'MATEO PEREZ',
    },
    {
      code: '2481',
      name: 'LA ESMERALDA DE CHOCHO',
    },
    {
      code: '2482',
      name: 'NUEVA ARGELIA',
    },
    {
      code: '2483',
      name: 'ZENU DEL ALTO SAN JORGE',
    },
    {
      code: '2484',
      name: 'OBONUCO',
    },
    {
      code: '2485',
      name: 'FLORESTA JAIDE',
    },
    {
      code: '2486',
      name: 'ALTO SANTANA',
    },
    {
      code: '2487',
      name: 'BAJO DE LATA',
    },
    {
      code: '2488',
      name: 'BOCA DE JARRO',
    },
    {
      code: '2489',
      name: 'BUENOS AIRES SUR',
    },
    {
      code: '2490',
      name: 'CRUZ DE MAYO',
    },
    {
      code: '2491',
      name: 'EL DIVIDIVI',
    },
    {
      code: '2492',
      name: 'EL HOYAL',
    },
    {
      code: '2493',
      name: 'HOJA ANCHA',
    },
    {
      code: '2494',
      name: 'LOS CARRETOS',
    },
    {
      code: '2495',
      name: 'MAJAGUAL No. 2',
    },
    {
      code: '2496',
      name: 'MALA NOCHE',
    },
    {
      code: '2497',
      name: 'NUEVA UNION',
    },
    {
      code: '2498',
      name: 'PARAISO PLAZA BONITA',
    },
    {
      code: '2499',
      name: 'PROVIDENCIA SUR',
    },
    {
      code: '2500',
      name: 'PUEBLECITO SUR',
    },
    {
      code: '2501',
      name: 'RECUPERACION',
    },
    {
      code: '2502',
      name: 'SANTA FE DE LA CRUZ',
    },
    {
      code: '2503',
      name: 'TIERRA GRATA',
    },
    {
      code: '2504',
      name: 'VILLA ROSITA ARRIBA',
    },
    {
      code: '2505',
      name: 'VILLA ROSITA SUR',
    },
    {
      code: '2506',
      name: 'EL DELIRIO',
    },
    {
      code: '2507',
      name: 'DOUJURAVIDA',
    },
    {
      code: '2508',
      name: 'CANAL DEL DIEZ',
    },
    {
      code: '2509',
      name: 'MORROY',
    },
    {
      code: '2510',
      name: 'AWA IM',
    },
    {
      code: '2511',
      name: 'AWA TATCHAN',
    },
    {
      code: '2512',
      name: 'AWA LA UNION LA DORADA',
    },
    {
      code: '2513',
      name: 'NUKANCHIPA TAITA KAUSADIRU',
    },
    {
      code: '2514',
      name: 'ALNAMAWAMI',
    },
    {
      code: '2515',
      name: 'PIBI PAI',
    },
    {
      code: '2516',
      name: 'CHANUL',
    },
    {
      code: '2517',
      name: 'INKAL WATZAL',
    },
    {
      code: '2518',
      name: 'RENACER AWA',
    },
    {
      code: '2519',
      name: 'ANCESTROS COYA MANAGRANDE TERRITORIO SAGRADO',
    },
    {
      code: '2520',
      name: 'SIONA CITARA',
    },
    {
      code: '2521',
      name: 'MOCONDINO',
    },
    {
      code: '2522',
      name: 'SAN MATIAS',
    },
    {
      code: '2523',
      name: 'SANTIAGO ABAJO',
    },
    {
      code: '2524',
      name: 'KWEÂ´SX KIWE',
    },
    {
      code: '2525',
      name: 'LA UNION DEL ALGODÃ“N',
    },
    {
      code: '2526',
      name: 'LOS CERROS',
    },
    {
      code: '2527',
      name: 'AMBACHEKE',
    },
    {
      code: '2528',
      name: 'LA FLORESTA',
    },
    {
      code: '2529',
      name: 'BOCAS DE KUMEJ',
    },
    {
      code: '2530',
      name: 'RETIRO DE LOS INDIOS',
    },
    {
      code: '2531',
      name: 'PATILLAL',
    },
    {
      code: '2532',
      name: 'PARANTIZA',
    },
    {
      code: '2533',
      name: 'CEIEWA',
    },
    {
      code: '2534',
      name: 'YORROBO',
    },
    {
      code: '2535',
      name: 'JAENI DONA PORTAL FRAGUITA',
    },
    {
      code: '2536',
      name: 'MUSUIUIAI',
    },
    {
      code: '2537',
      name: 'KANALITOJO',
    },
    {
      code: '2538',
      name: 'UNION WOUNAAN NONAM',
    },
    {
      code: '2539',
      name: 'INGA JOSE HOMERO',
    },
    {
      code: '2540',
      name: 'LOMA REDONDA â€“ KIWE THATADX',
    },
    {
      code: '2541',
      name: 'TERRITORIO ANCESTRAL DE PUEBLO NUEVO-SXAB USE YU LUX',
    },
    {
      code: '2542',
      name: 'CALAFITAS I',
    },
    {
      code: '2543',
      name: 'CALAFITAS II',
    },
    {
      code: '2544',
      name: 'UNCACIA',
    },
    {
      code: '2545',
      name: 'SELVAS DEL PUTUMAYO',
    },
    {
      code: '2546',
      name: 'PIJAO LA SIERRITA',
    },
    {
      code: '2547',
      name: 'CHIMBAGAL',
    },
    {
      code: '2548',
      name: 'HEREDEROS DE TABACO',
    },
    {
      code: '2549',
      name: 'AWA NAMBI PIEDRA VERDE',
    },
    {
      code: '2550',
      name: 'NASA LA NUEVA ESPERANZA',
    },
    {
      code: '2551',
      name: 'EMBERA PASO DEL RIO SALADO',
    },
    {
      code: '2552',
      name: 'PLAYA RICA',
    },
    { code: '2553', name: 'YARUMO PILT KWAZI' },
  ];
  return db.insert(indigenousReserves).values(values);
}

async function seedPopulations() {
  await db.delete(populations);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'VICTIMAS DEL CONFLICTO ARMADO' },
    { code: '2', name: 'EN CONDICION DE DESPLAZAMIENTO' },
    { code: '3', name: 'EN CONDICION DE DISCAPACIDAD FISICA' },
    { code: '4', name: 'VICTIMAS DEL CONFLICTO ARMADO Y EN CONDICION DE DESPLAZAMIENTO' },
    { code: '5', name: 'VICTIMAS DEL CONFLICTO ARMADO Y EN CONDICION DE DISCAPACIDAD FISICA' },
    {
      code: '6',
      name: 'VICTIMAS DEL CONFLICTO ARMADO EN CONDICION DE DESPLAZAMIENTO Y EN CONDICION DE DISCAPACIDAD FISICA',
    },
    { code: '7', name: 'EN CONDICION DE DESPLAZAMIENTO Y EN CONDICION DE DISCAPACIDAD FISICA' },
    { code: '8', name: 'NO APLICA' },
  ];
  return db.insert(populations).values(values);
}

async function seedSchoolGrades() {
  await db.delete(schoolGrades);
  const values = [
    { id: 0, code: '0', name: 'NO APLICA' },
    { code: '1', name: 'PRIMERO' },
    { code: '2', name: 'SEGUNDO' },
    { code: '3', name: 'TERCERO' },
    { code: '4', name: 'CUARTO' },
    { code: '5', name: 'QUINTO' },
    { code: '6', name: 'SEXTO' },
    { code: '7', name: 'SEPTIMO' },
    { code: '8', name: 'OCTAVO' },
    { code: '9', name: 'NOVENO' },
    { code: '10', name: 'DECIMO' },
    { code: '11', name: 'UNDECIMO' },
    { code: '12', name: 'DOCE' },
  ];
  return db.insert(schoolGrades).values(values);
}

async function seedShifts() {
  await db.delete(shifts);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'MAÑANA' },
    { code: '2', name: 'TARDE' },
    { code: '3', name: 'NOCTURNA' },
    { code: '4', name: 'JORNADA UNICA' },
  ];
  return db.insert(shifts).values(values);
}

async function seedStates() {
  await db.delete(states);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '05', name: 'ANTIOQUIA' },
    { code: '08', name: 'ATLANTICO' },
    { code: '11', name: 'SANTAFE DE BOGOTA' },
    { code: '13', name: 'BOLIVAR' },
    { code: '15', name: 'BOYACA' },
    { code: '17', name: 'CALDAS' },
    { code: '18', name: 'CAQUETA' },
    { code: '19', name: 'CAUCA' },
    { code: '20', name: 'CESAR' },
    { code: '23', name: 'CORDOBA' },
    { code: '25', name: 'CUNDINAMARCA' },
    { code: '27', name: 'CHOCO' },
    { code: '41', name: 'HUILA' },
    { code: '44', name: 'LA GUAGIRA' },
    { code: '47', name: 'MAGDALENA' },
    { code: '50', name: 'META' },
    { code: '52', name: 'NARINO' },
    { code: '54', name: 'NORTE DE SANTANDER' },
    { code: '63', name: 'QUINDIO' },
    { code: '66', name: 'RISARALDA' },
    { code: '68', name: 'SANTANDER' },
    { code: '70', name: 'SUCRE' },
    { code: '73', name: 'TOLIMA' },
    { code: '76', name: 'VALLE DEL CAUCA' },
    { code: '81', name: 'ARAUCA' },
    { code: '85', name: 'CASANARE' },
    { code: '86', name: 'PUTUMAYO' },
    { code: '88', name: 'ARCHIPIELAGO DE SAN ANDRES' },
    { code: '91', name: 'AMAZONAS' },
    { code: '94', name: 'GUAINIA' },
    { code: '95', name: 'GUAVIARE' },
    { code: '97', name: 'VAUPES' },
    { code: '99', name: 'VICHADA' },
  ];
  return db.insert(states).values(values);
}

async function seedVulnerabilityFactors() {
  await db.delete(vulnerabilityFactors);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '1', name: 'DESPLAZADO' },
    { code: '2', name: 'VICTIMA DEL CONFLICTO ARMADO (NO DESPLAZADO)' },
    { code: '3', name: 'DESMOVILIZADO O REINSERTADO' },
    { code: '4', name: 'HIJO(AS) DE DESMOVILIZADOS O REINSERTADOS' },
    { code: '5', name: 'DAMNIFICADO DESASTRE NATURAL' },
    { code: '6', name: 'EN CONDICION DE DISCAPACIDAD' },
    { code: '7', name: 'HIJO(AS) DE MADRES CABEZA DE FAMILIA' },
    { code: '8', name: 'POBLACION ZONAS FRONTERA (NACIONALES)' },
    { code: '9', name: 'EJERCICIO DEL TRABAJO SEXUAL' },
    { code: '10', name: 'NO APLICA' },
    { code: '11', name: 'CABEZA DE FAMILIA' },
    { code: '12', name: 'POBLACION MIGRANTE' },
    { code: '13', name: 'NO DISPONIBLE' },
  ];
  return db.insert(vulnerabilityFactors).values(values);
}

async function seedCountries() {
  await db.delete(countries);
  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '13', name: 'AFGANISTAN' },
    { code: '17', name: 'ALBANIA' },
    { code: '23', name: 'ALEMANIA' },
    { code: '26', name: 'ARMENIA' },
    { code: '27', name: 'ARUBA' },
    { code: '29', name: 'BOSNIA-HERZEGOVINA' },
    { code: '31', name: 'BURKINA FASSO' },
    { code: '37', name: 'ANDORRA' },
    { code: '40', name: 'ANGOLA' },
    { code: '41', name: 'ANGUILLA' },
    { code: '43', name: 'ANTIGUA Y BARBUDA' },
    { code: '47', name: 'ANTILLAS HOLANDESAS' },
    { code: '53', name: 'ARABIA SAUDITA' },
    { code: '59', name: 'ARGELIA' },
    { code: '63', name: 'ARGENTINA' },
    { code: '69', name: 'AUSTRALIA' },
    { code: '72', name: 'AUSTRIA' },
    { code: '74', name: 'AZERBAIJAN' },
    { code: '77', name: 'BAHAMAS' },
    { code: '80', name: 'BAHREIN' },
    { code: '81', name: 'BANGLADESH' },
    { code: '83', name: 'BARBADOS' },
    { code: '87', name: 'BELGICA' },
    { code: '88', name: 'BELICE' },
    { code: '90', name: 'BERMUDAS' },
    { code: '91', name: 'BELARUS' },
    { code: '93', name: 'BIRMANIA (MYANMAR)' },
    { code: '97', name: 'BOLIVIA' },
    { code: '101', name: 'BOTSWANA' },
    { code: '105', name: 'BRASIL' },
    { code: '108', name: 'BRUNEI DARUSSALAM' },
    { code: '111', name: 'BULGARIA' },
    { code: '115', name: 'BURUNDI' },
    { code: '119', name: 'BUTAN' },
    { code: '127', name: 'CABO VERDE' },
    { code: '137', name: 'CAIMAN, ISLAS' },
    { code: '141', name: 'CAMBOYA (KAMPUCHEA)' },
    { code: '145', name: 'CAMERUN, REPUBLICA UNIDA DEL' },
    { code: '149', name: 'CANADA' },
    { code: '159', name: 'SANTA SEDE' },
    { code: '165', name: 'COCOS (KEELING), ISLAS' },
    { code: '170', name: 'COLOMBIA' },
    { code: '173', name: 'COMORAS' },
    { code: '177', name: 'CONGO' },
    { code: '183', name: 'COOK, ISLAS' },
    { code: '187', name: 'COREA (NORTE), REPUBLICA POPUL' },
    { code: '190', name: 'COREA (SUR), REPUBLICA DE' },
    { code: '193', name: 'COSTA DE MARFIL' },
    { code: '196', name: 'COSTA RICA' },
    { code: '198', name: 'CROACIA' },
    { code: '199', name: 'CUBA' },
    { code: '203', name: 'CHAD' },
    { code: '211', name: 'CHILE' },
    { code: '215', name: 'CHINA' },
    { code: '218', name: 'TAIWAN (FORMOSA)' },
    { code: '221', name: 'CHIPRE' },
    { code: '229', name: 'BENIN' },
    { code: '232', name: 'DINAMARCA' },
    { code: '235', name: 'DOMINICA' },
    { code: '239', name: 'ECUADOR' },
    { code: '240', name: 'EGIPTO' },
    { code: '242', name: 'EL SALVADOR' },
    { code: '243', name: 'ERITREA' },
    { code: '244', name: 'EMIRATOS ARABES UNIDOS' },
    { code: '245', name: 'ESPAÑA' },
    { code: '246', name: 'ESLOVAQUIA' },
    { code: '247', name: 'ESLOVENIA' },
    { code: '249', name: 'ESTADOS UNIDOS' },
    { code: '251', name: 'ESTONIA' },
    { code: '253', name: 'ETIOPIA' },
    { code: '259', name: 'FEROE, ISLAS' },
    { code: '267', name: 'FILIPINAS' },
    { code: '271', name: 'FINLANDIA' },
    { code: '275', name: 'FRANCIA' },
    { code: '281', name: 'GABON' },
    { code: '285', name: 'GAMBIA' },
    { code: '287', name: 'GEORGIA' },
    { code: '289', name: 'GHANA' },
    { code: '293', name: 'GIBRALTAR' },
    { code: '297', name: 'GRANADA' },
    { code: '301', name: 'GRECIA' },
    { code: '305', name: 'GROENLANDIA' },
    { code: '309', name: 'GUADALUPE' },
    { code: '313', name: 'GUAM' },
    { code: '317', name: 'GUATEMALA' },
    { code: '325', name: 'GUAYANA FRANCESA' },
    { code: '329', name: 'GUINEA' },
    { code: '331', name: 'GUINEA ECUATORIAL' },
    { code: '334', name: 'GUINEA-BISSAU' },
    { code: '337', name: 'GUYANA' },
    { code: '341', name: 'HAITI' },
    { code: '345', name: 'HONDURAS' },
    { code: '351', name: 'HONG KONG' },
    { code: '355', name: 'HUNGRIA' },
    { code: '361', name: 'INDIA' },
    { code: '365', name: 'INDONESIA' },
    { code: '369', name: 'IRAK' },
    { code: '372', name: 'IRAN, REPUBLICA ISLAMICA DEL' },
    { code: '375', name: 'IRLANDA (EIRE)' },
    { code: '379', name: 'ISLANDIA' },
    { code: '383', name: 'ISRAEL' },
    { code: '386', name: 'ITALIA' },
    { code: '391', name: 'JAMAICA' },
    { code: '399', name: 'JAPON' },
    { code: '403', name: 'JORDANIA' },
    { code: '406', name: 'KAZAJSTAN' },
    { code: '410', name: 'KENIA' },
    { code: '411', name: 'KIRIBATI' },
    { code: '412', name: 'KIRGUIZISTAN' },
    { code: '413', name: 'KUWAIT' },
    { code: '420', name: 'LAOS, REPUBLICA POPULAR DEMOCR' },
    { code: '426', name: 'LESOTHO' },
    { code: '429', name: 'LETONIA' },
    { code: '431', name: 'LIBANO' },
    { code: '434', name: 'LIBERIA' },
    { code: '438', name: 'LIBIA (INCLUYE FEZZAN)' },
    { code: '440', name: 'LIECHTENSTEIN' },
    { code: '443', name: 'LITUANIA' },
    { code: '445', name: 'LUXEMBURGO' },
    { code: '447', name: 'MACAO' },
    { code: '448', name: 'MACEDONIA' },
    { code: '450', name: 'MADAGASCAR' },
    { code: '455', name: 'MALAYSIA' },
    { code: '458', name: 'MALAWI' },
    { code: '461', name: 'MALDIVAS' },
    { code: '464', name: 'MALDIVAS' },
    { code: '467', name: 'MALÍ' },
    { code: '470', name: 'MALTA' },
    { code: '473', name: 'MARRUECOS' },
    { code: '475', name: 'MARTINICA' },
    { code: '479', name: 'MAURICIO' },
    { code: '482', name: 'MAURITANIA' },
    { code: '487', name: 'MAYOTTE' },
    { code: '491', name: 'MEXICO' },
    { code: '494', name: 'MICRONESIA' },
    { code: '496', name: 'MOLDAVIA' },
    { code: '497', name: 'MONACO' },
    { code: '503', name: 'MONGOLIA' },
    { code: '506', name: 'MONTENEGRO' },
    { code: '509', name: 'MOZAMBIQUE' },
    { code: '511', name: 'NAMIBIA' },
    { code: '514', name: 'NAURU' },
    { code: '518', name: 'NEPAL' },
    { code: '523', name: 'NICARAGUA' },
    { code: '525', name: 'NÍGER' },
    { code: '528', name: 'NÍGERIA' },
    { code: '530', name: 'NIUE' },
    { code: '533', name: 'NORUEGA' },
    { code: '537', name: 'NUEVA CALEDONIA' },
    { code: '539', name: 'NUEVA ZELANDA' },
    { code: '544', name: 'OMÁN' },
    { code: '549', name: 'PAKISTÁN' },
    { code: '550', name: 'PALAU' },
    { code: '554', name: 'PANAMÁ' },
    { code: '557', name: 'PAPÚA NUEVA GUINEA' },
    { code: '561', name: 'PARAGUAY' },
    { code: '563', name: 'PERÚ' },
    { code: '566', name: 'POLONIA' },
    { code: '570', name: 'PORTUGAL' },
    { code: '573', name: 'PUERTO RICO' },
    { code: '575', name: 'QATAR' },
    { code: '577', name: 'REINO UNIDO' },
    { code: '580', name: 'REUNIÓN' },
    { code: '585', name: 'RUMANÍA' },
    { code: '587', name: 'RUSIA' },
    { code: '591', name: 'RWANDA' },
    { code: '593', name: 'SAMOA' },
    { code: '595', name: 'SAN CRISTÓBAL Y NIEVES' },
    { code: '598', name: 'SAN MARINO' },
    { code: '601', name: 'SAN PIERRE Y MIQUELÓN' },
    { code: '603', name: 'SANTA LUCÍA' },
    { code: '605', name: 'SANTO TOMÉ Y PRÍNCIPE' },
    { code: '607', name: 'SINGAPUR' },
    { code: '609', name: 'SIRIA' },
    { code: '611', name: 'SOMALIA' },
    { code: '613', name: 'SRI LANKA' },
    { code: '615', name: 'SUDAFRICA' },
    { code: '617', name: 'SUDÁN' },
    { code: '619', name: 'SUECIA' },
    { code: '623', name: 'SUIZA' },
    { code: '626', name: 'SURINAM' },
    { code: '629', name: 'SVALBARD' },
    { code: '633', name: 'SRI LANKA' },
    { code: '635', name: 'SUDÁN DEL SUR' },
    { code: '640', name: 'SINGAPUR' },
    { code: '642', name: 'SOMALIA' },
    { code: '650', name: 'TADJIKISTÁN' },
    { code: '660', name: 'TAIWÁN' },
    { code: '663', name: 'TANZANIA' },
    { code: '665', name: 'TERRITORIO BRITÁNICO DEL OCEÁNO ÍNDICO' },
    { code: '668', name: 'TERRITORIOS FRANCESES DEL SUR' },
    { code: '670', name: 'THAILANDIA' },
    { code: '675', name: 'TÍBET' },
    { code: '680', name: 'TONGA' },
    { code: '683', name: 'TRINIDAD Y TOBAGO' },
    { code: '685', name: 'TURKMENISTÁN' },
    { code: '687', name: 'TURQUÍA' },
    { code: '689', name: 'TUVALU' },
    { code: '693', name: 'TURKMENISTÁN' },
    { code: '695', name: 'TÚNEZ' },
    { code: '697', name: 'UCRANIA' },
    { code: '702', name: 'UGANDA' },
    { code: '705', name: 'URUGUAY' },
    { code: '707', name: 'UZBEKISTÁN' },
    { code: '710', name: 'VANUATU' },
    { code: '715', name: 'VENEZUELA' },
    { code: '717', name: 'VIETNAM' },
    { code: '721', name: 'YEMEN' },
    { code: '724', name: 'ZAMBIA' },
    { code: '728', name: 'ZANZÍBAR' },
    { code: '730', name: 'ZIMBABUE' },
  ];
  return db.insert(countries).values(values);
}

async function seedCities() {
  await db.delete(cities);

  const values = [
    { id: 0, code: '0', name: 'NO DATA' },
    { code: '05001', name: 'MEDELLÍN' },
    { code: '05002', name: 'ABEJORRAL' },
    { code: '05004', name: 'ABRIAQUÍ' },
    { code: '05021', name: 'ALEJANDRÍA' },
    { code: '05030', name: 'AMAGÁ' },
    { code: '05031', name: 'AMALFI' },
    { code: '05034', name: 'ANDES' },
    { code: '05036', name: 'ANGELÓPOLIS' },
    { code: '05038', name: 'ANGOSTURA' },
    { code: '05040', name: 'ANORÍ' },
    { code: '05042', name: 'SANTA FÉ DE ANTIOQUIA' },
    { code: '05044', name: 'ANZÁ' },
    { code: '05045', name: 'APARTADÓ' },
    { code: '05051', name: 'ARBOLETES' },
    { code: '05055', name: 'ARGELIA' },
    { code: '05059', name: 'ARMENIA' },
    { code: '05079', name: 'BARBOSA' },
    { code: '05086', name: 'BELMIRA' },
    { code: '05088', name: 'BELLO' },
    { code: '05091', name: 'BETANIA' },
    { code: '05093', name: 'BETULIA' },
    { code: '05101', name: 'CIUDAD BOLÍVAR' },
    { code: '05107', name: 'BRICEÑO' },
    { code: '05113', name: 'BURITICÁ' },
    { code: '05120', name: 'CÁCERES' },
    { code: '05125', name: 'CAICEDO' },
    { code: '05129', name: 'CALDAS' },
    { code: '05134', name: 'CAMPAMENTO' },
    { code: '05138', name: 'CAÑASGORDAS' },
    { code: '05142', name: 'CARACOLÍ' },
    { code: '05145', name: 'CARAMANTA' },
    { code: '05147', name: 'CAREPA' },
    { code: '05148', name: 'EL CARMEN DE VIBORAL' },
    { code: '05150', name: 'CAROLINA' },
    { code: '05154', name: 'CAUCASIA' },
    { code: '05172', name: 'CHIGORODÓ' },
    { code: '05190', name: 'CISNEROS' },
    { code: '05197', name: 'COCORNÁ' },
    { code: '05206', name: 'CONCEPCIÓN' },
    { code: '05209', name: 'CONCORDIA' },
    { code: '05212', name: 'COPACABANA' },
    { code: '05234', name: 'DABEIBA' },
    { code: '05237', name: 'DONMATÍAS' },
    { code: '05240', name: 'EBÉJICO' },
    { code: '05250', name: 'EL BAGRE' },
    { code: '05264', name: 'ENTRERRÍOS' },
    { code: '05266', name: 'ENVIGADO' },
    { code: '05282', name: 'FREDONIA' },
    { code: '05284', name: 'FRONTINO' },
    { code: '05306', name: 'GIRALDO' },
    { code: '05308', name: 'GIRARDOTA' },
    { code: '05310', name: 'GÓMEZ PLATA' },
    { code: '05313', name: 'GRANADA' },
    { code: '05315', name: 'GUADALUPE' },
    { code: '05318', name: 'GUARNE' },
    { code: '05321', name: 'GUATAPÉ' },
    { code: '05347', name: 'HELICONIA' },
    { code: '05353', name: 'HISPANIA' },
    { code: '05360', name: 'ITAGÜÍ' },
    { code: '05361', name: 'ITUANGO' },
    { code: '05364', name: 'JARDÍN' },
    { code: '05368', name: 'JERICÓ' },
    { code: '05376', name: 'LA CEJA' },
    { code: '05380', name: 'LA ESTRELLA' },
    { code: '05390', name: 'LA PINTADA' },
    { code: '05400', name: 'LA UNIÓN' },
    { code: '05411', name: 'LIBORINA' },
    { code: '05425', name: 'MACEO' },
    { code: '05440', name: 'MARINILLA' },
    { code: '05467', name: 'MONTEBELLO' },
    { code: '05475', name: 'MURINDÓ' },
    { code: '05480', name: 'MUTATÁ' },
    { code: '05483', name: 'NARIÑO' },
    { code: '05490', name: 'NECOCLÍ' },
    { code: '05495', name: 'NECHÍ' },
    { code: '05501', name: 'OLAYA' },
    { code: '05541', name: 'PEÑOL' },
    { code: '05543', name: 'PEQUE' },
    { code: '05576', name: 'PUEBLORRICO' },
    { code: '05579', name: 'PUERTO BERRÍO' },
    { code: '05585', name: 'PUERTO NARE' },
    { code: '05591', name: 'PUERTO TRIUNFO' },
    { code: '05604', name: 'REMEDIOS' },
    { code: '05607', name: 'RETIRO' },
    { code: '05615', name: 'RIONEGRO' },
    { code: '05628', name: 'SABANALARGA' },
    { code: '05631', name: 'SABANETA' },
    { code: '05642', name: 'SALGAR' },
    { code: '05647', name: 'SAN ANDRÉS DE CUERQUÍA' },
    { code: '05649', name: 'SAN CARLOS' },
    { code: '05652', name: 'SAN FRANCISCO' },
    { code: '05656', name: 'SAN JERÓNIMO' },
    { code: '05658', name: 'SAN JOSÉ DE LA MONTAÑA' },
    { code: '05659', name: 'SAN JUAN DE URABÁ' },
    { code: '05660', name: 'SAN LUIS' },
    { code: '05664', name: 'SAN PEDRO DE LOS MILAGROS' },
    { code: '05665', name: 'SAN PEDRO DE URABÁ' },
    { code: '05667', name: 'SAN RAFAEL' },
    { code: '05670', name: 'SAN ROQUE' },
    { code: '05674', name: 'SAN VICENTE FERRER' },
    { code: '05679', name: 'SANTA BÁRBARA' },
    { code: '05686', name: 'SANTA ROSA DE OSOS' },
    { code: '05690', name: 'SANTO DOMINGO' },
    { code: '05697', name: 'EL SANTUARIO' },
    { code: '05736', name: 'SEGOVIA' },
    { code: '05756', name: 'SONSÓN' },
    { code: '05761', name: 'SOPETRÁN' },
    { code: '05789', name: 'TÁMESIS' },
    { code: '05790', name: 'TARAZÁ' },
    { code: '05792', name: 'TARSO' },
    { code: '05809', name: 'TITIRIBÍ' },
    { code: '05819', name: 'TOLEDO' },
    { code: '05837', name: 'TURBO' },
    { code: '05842', name: 'URAMITA' },
    { code: '05847', name: 'URRAO' },
    { code: '05854', name: 'VALDIVIA' },
    { code: '05856', name: 'VALPARAÍSO' },
    { code: '05858', name: 'VEGACHÍ' },
    { code: '05861', name: 'VENECIA' },
    { code: '05873', name: 'VIGÍA DEL FUERTE' },
    { code: '05885', name: 'YALÍ' },
    { code: '05887', name: 'YARUMAL' },
    { code: '05890', name: 'YOLOMBÓ' },
    { code: '05893', name: 'YONDÓ' },
    { code: '05895', name: 'ZARAGOZA' },
    { code: '08001', name: 'BARRANQUILLA' },
    { code: '08078', name: 'BARANOA' },
    { code: '08137', name: 'CAMPO DE LA CRUZ' },
    { code: '08141', name: 'CANDELARIA' },
    { code: '08296', name: 'GALAPA' },
    { code: '08372', name: 'JUAN DE ACOSTA' },
    { code: '08421', name: 'LURUACO' },
    { code: '08433', name: 'MALAMBO' },
    { code: '08436', name: 'MANATÍ' },
    { code: '08520', name: 'PALMAR DE VARELA' },
    { code: '08549', name: 'PIOJÓ' },
    { code: '08558', name: 'POLONUEVO' },
    { code: '08560', name: 'PONEDERA' },
    { code: '08573', name: 'PUERTO COLOMBIA' },
    { code: '08606', name: 'REPELÓN' },
    { code: '08634', name: 'SABANAGRANDE' },
    { code: '08638', name: 'SABANALARGA' },
    { code: '08675', name: 'SANTA LUCÍA' },
    { code: '08685', name: 'SANTO TOMÁS' },
    { code: '08758', name: 'SOLEDAD' },
    { code: '08770', name: 'SUAN' },
    { code: '08832', name: 'TUBARÁ' },
    { code: '08849', name: 'USIACURÍ' },
    { code: '11001', name: 'BOGOTÁ. D.C.' },
    { code: '13001', name: 'CARTAGENA DE INDIAS' },
    { code: '13006', name: 'ACHÍ' },
    { code: '13030', name: 'ALTOS DEL ROSARIO' },
    { code: '13042', name: 'ARENAL' },
    {
      code: '13052',
      name: 'ARJONA',
    },
    {
      code: '13062',
      name: 'ARROYOHONDO',
    },
    {
      code: '13074',
      name: 'BARRANCO DE LOBA',
    },
    {
      code: '13140',
      name: 'CALAMAR',
    },
    {
      code: '13160',
      name: 'CANTAGALLO',
    },
    {
      code: '13188',
      name: 'CICUCO',
    },
    {
      code: '13212',
      name: 'CÓRDOBA',
    },
    {
      code: '13222',
      name: 'CLEMENCIA',
    },
    {
      code: '13244',
      name: 'EL CARMEN DE BOLÍVAR',
    },
    {
      code: '13248',
      name: 'EL GUAMO',
    },
    {
      code: '13268',
      name: 'EL PEÑÓN',
    },
    {
      code: '13300',
      name: 'HATILLO DE LOBA',
    },
    {
      code: '13430',
      name: 'MAGANGUÉ',
    },
    {
      code: '13433',
      name: 'MAHATES',
    },
    {
      code: '13440',
      name: 'MARGARITA',
    },
    {
      code: '13442',
      name: 'MARÍA LA BAJA',
    },
    {
      code: '13458',
      name: 'MONTECRISTO',
    },
    {
      code: '13468',
      name: 'SANTA CRUZ DE MOMPOX',
    },
    {
      code: '13473',
      name: 'MORALES',
    },
    {
      code: '13490',
      name: 'NOROSÍ',
    },
    {
      code: '13549',
      name: 'PINILLOS',
    },
    {
      code: '13580',
      name: 'REGIDOR',
    },
    {
      code: '13600',
      name: 'RÍO VIEJO',
    },
    {
      code: '13620',
      name: 'SAN CRISTÓBAL',
    },
    {
      code: '13647',
      name: 'SAN ESTANISLAO',
    },
    {
      code: '13650',
      name: 'SAN FERNANDO',
    },
    {
      code: '13654',
      name: 'SAN JACINTO',
    },
    {
      code: '13655',
      name: 'SAN JACINTO DEL CAUCA',
    },
    {
      code: '13657',
      name: 'SAN JUAN NEPOMUCENO',
    },
    {
      code: '13667',
      name: 'SAN MARTÍN DE LOBA',
    },
    {
      code: '13670',
      name: 'SAN PABLO',
    },
    {
      code: '13673',
      name: 'SANTA CATALINA',
    },
    {
      code: '13683',
      name: 'SANTA ROSA',
    },
    {
      code: '13688',
      name: 'SANTA ROSA DEL SUR',
    },
    {
      code: '13744',
      name: 'SIMITÍ',
    },
    {
      code: '13760',
      name: 'SOPLAVIENTO',
    },
    {
      code: '13780',
      name: 'TALAIGUA NUEVO',
    },
    {
      code: '13810',
      name: 'TIQUISIO',
    },
    {
      code: '13836',
      name: 'TURBACO',
    },
    {
      code: '13838',
      name: 'TURBANÁ',
    },
    {
      code: '13873',
      name: 'VILLANUEVA',
    },
    {
      code: '13894',
      name: 'ZAMBRANO',
    },
    {
      code: '15001',
      name: 'TUNJA',
    },
    {
      code: '15022',
      name: 'ALMEIDA',
    },
    {
      code: '15047',
      name: 'AQUITANIA',
    },
    {
      code: '15051',
      name: 'ARCABUCO',
    },
    {
      code: '15087',
      name: 'BELÉN',
    },
    {
      code: '15090',
      name: 'BERBEO',
    },
    {
      code: '15092',
      name: 'BETÉITIVA',
    },
    {
      code: '15097',
      name: 'BOAVITA',
    },
    {
      code: '15104',
      name: 'BOYACÁ',
    },
    {
      code: '15106',
      name: 'BRICEÑO',
    },
    {
      code: '15109',
      name: 'BUENAVISTA',
    },
    {
      code: '15114',
      name: 'BUSBANZÁ',
    },
    {
      code: '15131',
      name: 'CALDAS',
    },
    {
      code: '15135',
      name: 'CAMPOHERMOSO',
    },
    {
      code: '15162',
      name: 'CERINZA',
    },
    {
      code: '15172',
      name: 'CHINAVITA',
    },
    {
      code: '15176',
      name: 'CHIQUINQUIRÁ',
    },
    {
      code: '15180',
      name: 'CHISCAS',
    },
    {
      code: '15183',
      name: 'CHITA',
    },
    {
      code: '15185',
      name: 'CHITARAQUE',
    },
    {
      code: '15187',
      name: 'CHIVATÁ',
    },
    {
      code: '15189',
      name: 'CIÉNEGA',
    },
    {
      code: '15204',
      name: 'CÓMBITA',
    },
    {
      code: '15212',
      name: 'COPER',
    },
    {
      code: '15215',
      name: 'CORRALES',
    },
    {
      code: '15218',
      name: 'COVARACHÍA',
    },
    {
      code: '15223',
      name: 'CUBARÁ',
    },
    {
      code: '19318',
      name: 'GUAPI',
    },
    {
      code: '15224',
      name: 'CUCAITA',
    },
    {
      code: '15226',
      name: 'CUÍTIVA',
    },
    {
      code: '15232',
      name: 'CHÍQUIZA',
    },
    {
      code: '15236',
      name: 'CHIVOR',
    },
    {
      code: '15238',
      name: 'DUITAMA',
    },
    {
      code: '15244',
      name: 'EL COCUY',
    },
    {
      code: '15248',
      name: 'EL ESPINO',
    },
    {
      code: '15272',
      name: 'FIRAVITOBA',
    },
    {
      code: '15276',
      name: 'FLORESTA',
    },
    {
      code: '15293',
      name: 'GACHANTIVÁ',
    },
    {
      code: '15296',
      name: 'GÁMEZA',
    },
    {
      code: '15299',
      name: 'GARAGOA',
    },
    {
      code: '15317',
      name: 'GUACAMAYAS',
    },
    {
      code: '15322',
      name: 'GUATEQUE',
    },
    {
      code: '15325',
      name: 'GUAYATÁ',
    },
    {
      code: '15332',
      name: 'GÜICÁN DE LA SIERRA',
    },
    {
      code: '15362',
      name: 'IZA',
    },
    {
      code: '15367',
      name: 'JENESANO',
    },
    {
      code: '15368',
      name: 'JERICÓ',
    },
    {
      code: '15377',
      name: 'LABRANZAGRANDE',
    },
    {
      code: '15380',
      name: 'LA CAPILLA',
    },
    {
      code: '15401',
      name: 'LA VICTORIA',
    },
    {
      code: '15403',
      name: 'LA UVITA',
    },
    {
      code: '15407',
      name: 'VILLA DE LEYVA',
    },
    {
      code: '15425',
      name: 'MACANAL',
    },
    {
      code: '15442',
      name: 'MARIPÍ',
    },
    {
      code: '15455',
      name: 'MIRAFLORES',
    },
    {
      code: '15464',
      name: 'MONGUA',
    },
    {
      code: '15466',
      name: 'MONGUÍ',
    },
    {
      code: '15469',
      name: 'MONIQUIRÁ',
    },
    {
      code: '15476',
      name: 'MOTAVITA',
    },
    {
      code: '15480',
      name: 'MUZO',
    },
    {
      code: '15491',
      name: 'NOBSA',
    },
    {
      code: '15494',
      name: 'NUEVO COLÓN',
    },
    {
      code: '15500',
      name: 'OICATÁ',
    },
    {
      code: '15507',
      name: 'OTANCHE',
    },
    {
      code: '15511',
      name: 'PACHAVITA',
    },
    {
      code: '15514',
      name: 'PÁEZ',
    },
    {
      code: '15516',
      name: 'PAIPA',
    },
    {
      code: '15518',
      name: 'PAJARITO',
    },
    {
      code: '15522',
      name: 'PANQUEBA',
    },
    {
      code: '15531',
      name: 'PAUNA',
    },
    {
      code: '15533',
      name: 'PAYA',
    },
    {
      code: '15537',
      name: 'PAZ DE RÍO',
    },
    {
      code: '15542',
      name: 'PESCA',
    },
    {
      code: '15550',
      name: 'PISBA',
    },
    {
      code: '15572',
      name: 'PUERTO BOYACÁ',
    },
    {
      code: '15580',
      name: 'QUÍPAMA',
    },
    {
      code: '15599',
      name: 'RAMIRIQUÍ',
    },
    {
      code: '15600',
      name: 'RÁQUIRA',
    },
    {
      code: '15621',
      name: 'RONDÓN',
    },
    {
      code: '15632',
      name: 'SABOYÁ',
    },
    {
      code: '15638',
      name: 'SÁCHICA',
    },
    {
      code: '15646',
      name: 'SAMACÁ',
    },
    {
      code: '15660',
      name: 'SAN EDUARDO',
    },
    {
      code: '15664',
      name: 'SAN JOSÉ DE PARE',
    },
    {
      code: '15667',
      name: 'SAN LUIS DE GACENO',
    },
    {
      code: '15673',
      name: 'SAN MATEO',
    },
    {
      code: '15676',
      name: 'SAN MIGUEL DE SEMA',
    },
    {
      code: '15681',
      name: 'SAN PABLO DE BORBUR',
    },
    {
      code: '15686',
      name: 'SANTANA',
    },
    {
      code: '15690',
      name: 'SANTA MARÍA',
    },
    {
      code: '15693',
      name: 'SANTA ROSA DE VITERBO',
    },
    {
      code: '15696',
      name: 'SANTA SOFÍA',
    },
    {
      code: '15720',
      name: 'SATIVANORTE',
    },
    {
      code: '15723',
      name: 'SATIVASUR',
    },
    {
      code: '15740',
      name: 'SIACHOQUE',
    },
    {
      code: '15753',
      name: 'SOATÁ',
    },
    {
      code: '15755',
      name: 'SOCOTÁ',
    },
    {
      code: '15757',
      name: 'SOCHA',
    },
    {
      code: '15759',
      name: 'SOGAMOSO',
    },
    {
      code: '15761',
      name: 'SOMONDOCO',
    },
    {
      code: '15762',
      name: 'SORA',
    },
    {
      code: '15763',
      name: 'SOTAQUIRÁ',
    },
    {
      code: '15764',
      name: 'SORACÁ',
    },
    {
      code: '15774',
      name: 'SUSACÓN',
    },
    {
      code: '15776',
      name: 'SUTAMARCHÁN',
    },
    {
      code: '15778',
      name: 'SUTATENZA',
    },
    {
      code: '15790',
      name: 'TASCO',
    },
    {
      code: '15798',
      name: 'TENZA',
    },
    {
      code: '15804',
      name: 'TIBANÁ',
    },
    {
      code: '15806',
      name: 'TIBASOSA',
    },
    {
      code: '15808',
      name: 'TINJACÁ',
    },
    {
      code: '15810',
      name: 'TIPACOQUE',
    },
    {
      code: '15814',
      name: 'TOCA',
    },
    {
      code: '15816',
      name: 'TOGÜÍ',
    },
    {
      code: '15820',
      name: 'TÓPAGA',
    },
    {
      code: '15822',
      name: 'TOTA',
    },
    {
      code: '15832',
      name: 'TUNUNGUÁ',
    },
    {
      code: '15835',
      name: 'TURMEQUÉ',
    },
    {
      code: '15837',
      name: 'TUTA',
    },
    {
      code: '15839',
      name: 'TUTAZÁ',
    },
    {
      code: '15842',
      name: 'ÚMBITA',
    },
    {
      code: '15861',
      name: 'VENTAQUEMADA',
    },
    {
      code: '15879',
      name: 'VIRACACHÁ',
    },
    {
      code: '15897',
      name: 'ZETAQUIRA',
    },
    {
      code: '17001',
      name: 'MANIZALES',
    },
    {
      code: '17013',
      name: 'AGUADAS',
    },
    {
      code: '17042',
      name: 'ANSERMA',
    },
    {
      code: '17050',
      name: 'ARANZAZU',
    },
    {
      code: '17088',
      name: 'BELALCÁZAR',
    },
    {
      code: '17174',
      name: 'CHINCHINÁ',
    },
    {
      code: '17272',
      name: 'FILADELFIA',
    },
    {
      code: '17380',
      name: 'LA DORADA',
    },
    {
      code: '17388',
      name: 'LA MERCED',
    },
    {
      code: '17433',
      name: 'MANZANARES',
    },
    {
      code: '17442',
      name: 'MARMATO',
    },
    {
      code: '17444',
      name: 'MARQUETALIA',
    },
    {
      code: '17446',
      name: 'MARULANDA',
    },
    {
      code: '17486',
      name: 'NEIRA',
    },
    {
      code: '17495',
      name: 'NORCASIA',
    },
    {
      code: '17513',
      name: 'PÁCORA',
    },
    {
      code: '17524',
      name: 'PALESTINA',
    },
    {
      code: '17541',
      name: 'PENSILVANIA',
    },
    {
      code: '17614',
      name: 'RIOSUCIO',
    },
    {
      code: '17616',
      name: 'RISARALDA',
    },
    {
      code: '17653',
      name: 'SALAMINA',
    },
    {
      code: '17662',
      name: 'SAMANÁ',
    },
    {
      code: '17665',
      name: 'SAN JOSÉ',
    },
    {
      code: '17777',
      name: 'SUPÍA',
    },
    {
      code: '17867',
      name: 'VICTORIA',
    },
    {
      code: '17873',
      name: 'VILLAMARÍA',
    },
    {
      code: '17877',
      name: 'VITERBO',
    },
    {
      code: '18001',
      name: 'FLORENCIA',
    },
    {
      code: '18029',
      name: 'ALBANIA',
    },
    {
      code: '18094',
      name: 'BELÉN DE LOS ANDAQUÍES',
    },
    {
      code: '18150',
      name: 'CARTAGENA DEL CHAIRÁ',
    },
    {
      code: '18205',
      name: 'CURILLO',
    },
    {
      code: '18247',
      name: 'EL DONCELLO',
    },
    {
      code: '18256',
      name: 'EL PAUJÍL',
    },
    {
      code: '18410',
      name: 'LA MONTAÑITA',
    },
    {
      code: '18460',
      name: 'MILÁN',
    },
    {
      code: '18479',
      name: 'MORELIA',
    },
    {
      code: '18592',
      name: 'PUERTO RICO',
    },
    {
      code: '18610',
      name: 'SAN JOSÉ DEL FRAGUA',
    },
    {
      code: '18753',
      name: 'SAN VICENTE DEL CAGUÁN',
    },
    {
      code: '18756',
      name: 'SOLANO',
    },
    {
      code: '18785',
      name: 'SOLITA',
    },
    {
      code: '18860',
      name: 'VALPARAÍSO',
    },
    {
      code: '19001',
      name: 'POPAYÁN',
    },
    {
      code: '19022',
      name: 'ALMAGUER',
    },
    {
      code: '19050',
      name: 'ARGELIA',
    },
    {
      code: '19075',
      name: 'BALBOA',
    },
    {
      code: '19100',
      name: 'BOLÍVAR',
    },
    {
      code: '19110',
      name: 'BUENOS AIRES',
    },
    {
      code: '19130',
      name: 'CAJIBÍO',
    },
    {
      code: '19137',
      name: 'CALDONO',
    },
    {
      code: '19142',
      name: 'CALOTO',
    },
    {
      code: '19212',
      name: 'CORINTO',
    },
    {
      code: '19256',
      name: 'EL TAMBO',
    },
    {
      code: '19290',
      name: 'FLORENCIA',
    },
    {
      code: '19300',
      name: 'GUACHENÉ',
    },
    {
      code: '19355',
      name: 'INZÁ',
    },
    {
      code: '19364',
      name: 'JAMBALÓ',
    },
    {
      code: '19392',
      name: 'LA SIERRA',
    },
    {
      code: '19397',
      name: 'LA VEGA',
    },
    {
      code: '19418',
      name: 'LÓPEZ DE MICAY',
    },
    {
      code: '19450',
      name: 'MERCADERES',
    },
    {
      code: '19455',
      name: 'MIRANDA',
    },
    {
      code: '19473',
      name: 'MORALES',
    },
    {
      code: '19513',
      name: 'PADILLA',
    },
    {
      code: '19517',
      name: 'PÁEZ',
    },
    {
      code: '19532',
      name: 'PATÍA',
    },
    {
      code: '19533',
      name: 'PIAMONTE',
    },
    {
      code: '19548',
      name: 'PIENDAMÓ - TUNÍA',
    },
    {
      code: '19573',
      name: 'PUERTO TEJADA',
    },
    {
      code: '19585',
      name: 'PURACÉ',
    },
    {
      code: '19622',
      name: 'ROSAS',
    },
    {
      code: '19693',
      name: 'SAN SEBASTIÁN',
    },
    {
      code: '19698',
      name: 'SANTANDER DE QUILICHAO',
    },
    {
      code: '19701',
      name: 'SANTA ROSA',
    },
    {
      code: '19743',
      name: 'SILVIA',
    },
    {
      code: '19760',
      name: 'SOTARÁ PAISPAMBA',
    },
    {
      code: '19780',
      name: 'SUÁREZ',
    },
    {
      code: '19785',
      name: 'SUCRE',
    },
    {
      code: '19807',
      name: 'TIMBÍO',
    },
    {
      code: '19809',
      name: 'TIMBIQUÍ',
    },
    {
      code: '19821',
      name: 'TORIBÍO',
    },
    {
      code: '19824',
      name: 'TOTORÓ',
    },
    {
      code: '19845',
      name: 'VILLA RICA',
    },
    {
      code: '20001',
      name: 'VALLEDUPAR',
    },
    {
      code: '20011',
      name: 'AGUACHICA',
    },
    {
      code: '20013',
      name: 'AGUSTÍN CODAZZI',
    },
    {
      code: '20032',
      name: 'ASTREA',
    },
    {
      code: '20045',
      name: 'BECERRIL',
    },
    {
      code: '20060',
      name: 'BOSCONIA',
    },
    {
      code: '20175',
      name: 'CHIMICHAGUA',
    },
    {
      code: '20178',
      name: 'CHIRIGUANÁ',
    },
    {
      code: '20228',
      name: 'CURUMANÍ',
    },
    {
      code: '20238',
      name: 'EL COPEY',
    },
    {
      code: '20250',
      name: 'EL PASO',
    },
    {
      code: '20295',
      name: 'GAMARRA',
    },
    {
      code: '20310',
      name: 'GONZÁLEZ',
    },
    {
      code: '20383',
      name: 'LA GLORIA',
    },
    {
      code: '20400',
      name: 'LA JAGUA DE IBIRICO',
    },
    {
      code: '20443',
      name: 'MANAURE BALCÓN DEL CESAR',
    },
    {
      code: '20517',
      name: 'PAILITAS',
    },
    {
      code: '20550',
      name: 'PELAYA',
    },
    {
      code: '20570',
      name: 'PUEBLO BELLO',
    },
    {
      code: '20614',
      name: 'RÍO DE ORO',
    },
    {
      code: '20621',
      name: 'LA PAZ',
    },
    {
      code: '20710',
      name: 'SAN ALBERTO',
    },
    {
      code: '20750',
      name: 'SAN DIEGO',
    },
    {
      code: '20770',
      name: 'SAN MARTÍN',
    },
    {
      code: '20787',
      name: 'TAMALAMEQUE',
    },
    {
      code: '23001',
      name: 'MONTERÍA',
    },
    {
      code: '23068',
      name: 'AYAPEL',
    },
    {
      code: '23079',
      name: 'BUENAVISTA',
    },
    {
      code: '23090',
      name: 'CANALETE',
    },
    {
      code: '23162',
      name: 'CERETÉ',
    },
    {
      code: '23168',
      name: 'CHIMÁ',
    },
    {
      code: '23182',
      name: 'CHINÚ',
    },
    {
      code: '23189',
      name: 'CIÉNAGA DE ORO',
    },
    {
      code: '23300',
      name: 'COTORRA',
    },
    {
      code: '23350',
      name: 'LA APARTADA',
    },
    {
      code: '23417',
      name: 'LORICA',
    },
    {
      code: '23419',
      name: 'LOS CÓRDOBAS',
    },
    {
      code: '23464',
      name: 'MOMIL',
    },
    {
      code: '23466',
      name: 'MONTELÍBANO',
    },
    {
      code: '23500',
      name: 'MOÑITOS',
    },
    {
      code: '23555',
      name: 'PLANETA RICA',
    },
    {
      code: '23570',
      name: 'PUEBLO NUEVO',
    },
    {
      code: '23574',
      name: 'PUERTO ESCONDIDO',
    },
    {
      code: '23580',
      name: 'PUERTO LIBERTADOR',
    },
    {
      code: '23586',
      name: 'PURÍSIMA DE LA CONCEPCIÓN',
    },
    {
      code: '23660',
      name: 'SAHAGÚN',
    },
    {
      code: '23670',
      name: 'SAN ANDRÉS DE SOTAVENTO',
    },
    {
      code: '23672',
      name: 'SAN ANTERO',
    },
    {
      code: '23675',
      name: 'SAN BERNARDO DEL VIENTO',
    },
    {
      code: '23678',
      name: 'SAN CARLOS',
    },
    {
      code: '23682',
      name: 'SAN JOSÉ DE URÉ',
    },
    {
      code: '23686',
      name: 'SAN PELAYO',
    },
    {
      code: '23807',
      name: 'TIERRALTA',
    },
    {
      code: '23815',
      name: 'TUCHÍN',
    },
    {
      code: '23855',
      name: 'VALENCIA',
    },
    {
      code: '25001',
      name: 'AGUA DE DIOS',
    },
    {
      code: '25019',
      name: 'ALBÁN',
    },
    {
      code: '25035',
      name: 'ANAPOIMA',
    },
    {
      code: '25040',
      name: 'ANOLAIMA',
    },
    {
      code: '25053',
      name: 'ARBELÁEZ',
    },
    {
      code: '25086',
      name: 'BELTRÁN',
    },
    {
      code: '25095',
      name: 'BITUIMA',
    },
    {
      code: '25099',
      name: 'BOJACÁ',
    },
    {
      code: '25120',
      name: 'CABRERA',
    },
    {
      code: '25123',
      name: 'CACHIPAY',
    },
    {
      code: '25126',
      name: 'CAJICÁ',
    },
    {
      code: '25148',
      name: 'CAPARRAPÍ',
    },
    {
      code: '25151',
      name: 'CÁQUEZA',
    },
    {
      code: '25154',
      name: 'CARMEN DE CARUPA',
    },
    {
      code: '25168',
      name: 'CHAGUANÍ',
    },
    {
      code: '25175',
      name: 'CHÍA',
    },
    {
      code: '25178',
      name: 'CHIPAQUE',
    },
    {
      code: '25181',
      name: 'CHOACHÍ',
    },
    {
      code: '25183',
      name: 'CHOCONTÁ',
    },
    {
      code: '25200',
      name: 'COGUA',
    },
    {
      code: '25214',
      name: 'COTA',
    },
    {
      code: '25224',
      name: 'CUCUNUBÁ',
    },
    {
      code: '25245',
      name: 'EL COLEGIO',
    },
    {
      code: '25258',
      name: 'EL PEÑÓN',
    },
    {
      code: '25260',
      name: 'EL ROSAL',
    },
    {
      code: '25269',
      name: 'FACATATIVÁ',
    },
    {
      code: '25279',
      name: 'FÓMEQUE',
    },
    {
      code: '25281',
      name: 'FOSCA',
    },
    {
      code: '25286',
      name: 'FUNZA',
    },
    {
      code: '25288',
      name: 'FÚQUENE',
    },
    {
      code: '25290',
      name: 'FUSAGASUGÁ',
    },
    {
      code: '25293',
      name: 'GACHALÁ',
    },
    {
      code: '25295',
      name: 'GACHANCIPÁ',
    },
    {
      code: '25297',
      name: 'GACHETÁ',
    },
    {
      code: '25299',
      name: 'GAMA',
    },
    {
      code: '25307',
      name: 'GIRARDOT',
    },
    {
      code: '25312',
      name: 'GRANADA',
    },
    {
      code: '25317',
      name: 'GUACHETÁ',
    },
    {
      code: '25320',
      name: 'GUADUAS',
    },
    {
      code: '25322',
      name: 'GUASCA',
    },
    {
      code: '25324',
      name: 'GUATAQUÍ',
    },
    {
      code: '25326',
      name: 'GUATAVITA',
    },
    {
      code: '25328',
      name: 'GUAYABAL DE SÍQUIMA',
    },
    {
      code: '25335',
      name: 'GUAYABETAL',
    },
    {
      code: '25339',
      name: 'GUTIÉRREZ',
    },
    {
      code: '25368',
      name: 'JERUSALÉN',
    },
    {
      code: '25372',
      name: 'JUNÍN',
    },
    {
      code: '25377',
      name: 'LA CALERA',
    },
    {
      code: '25386',
      name: 'LA MESA',
    },
    {
      code: '25394',
      name: 'LA PALMA',
    },
    {
      code: '25398',
      name: 'LA PEÑA',
    },
    {
      code: '25402',
      name: 'LA VEGA',
    },
    {
      code: '25407',
      name: 'LENGUAZAQUE',
    },
    {
      code: '25426',
      name: 'MACHETÁ',
    },
    {
      code: '25430',
      name: 'MADRID',
    },
    {
      code: '25436',
      name: 'MANTA',
    },
    {
      code: '25438',
      name: 'MEDINA',
    },
    {
      code: '25473',
      name: 'MOSQUERA',
    },
    {
      code: '25483',
      name: 'NARIÑO',
    },
    {
      code: '25486',
      name: 'NEMOCÓN',
    },
    {
      code: '25488',
      name: 'NILO',
    },
    {
      code: '25489',
      name: 'NIMAIMA',
    },
    {
      code: '25491',
      name: 'NOCAIMA',
    },
    {
      code: '25506',
      name: 'VENECIA',
    },
    {
      code: '25513',
      name: 'PACHO',
    },
    {
      code: '25518',
      name: 'PAIME',
    },
    {
      code: '25524',
      name: 'PANDI',
    },
    {
      code: '25530',
      name: 'PARATEBUENO',
    },
    {
      code: '25535',
      name: 'PASCA',
    },
    {
      code: '25572',
      name: 'PUERTO SALGAR',
    },
    {
      code: '25580',
      name: 'PULÍ',
    },
    {
      code: '25592',
      name: 'QUEBRADANEGRA',
    },
    {
      code: '25594',
      name: 'QUETAME',
    },
    {
      code: '25596',
      name: 'QUIPILE',
    },
    {
      code: '25599',
      name: 'APULO',
    },
    {
      code: '25612',
      name: 'RICAURTE',
    },
    {
      code: '25645',
      name: 'SAN ANTONIO DEL TEQUENDAMA',
    },
    {
      code: '25649',
      name: 'SAN BERNARDO',
    },
    {
      code: '25653',
      name: 'SAN CAYETANO',
    },
    {
      code: '25658',
      name: 'SAN FRANCISCO',
    },
    {
      code: '25662',
      name: 'SAN JUAN DE RIOSECO',
    },
    {
      code: '25718',
      name: 'SASAIMA',
    },
    {
      code: '25736',
      name: 'SESQUILÉ',
    },
    {
      code: '25740',
      name: 'SIBATÉ',
    },
    {
      code: '25743',
      name: 'SILVANIA',
    },
    {
      code: '25745',
      name: 'SIMIJACA',
    },
    {
      code: '25754',
      name: 'SOACHA',
    },
    {
      code: '25758',
      name: 'SOPÓ',
    },
    {
      code: '25769',
      name: 'SUBACHOQUE',
    },
    {
      code: '25772',
      name: 'SUESCA',
    },
    {
      code: '25777',
      name: 'SUPATÁ',
    },
    {
      code: '25779',
      name: 'SUSA',
    },
    {
      code: '25781',
      name: 'SUTATAUSA',
    },
    {
      code: '25785',
      name: 'TABIO',
    },
    {
      code: '25793',
      name: 'TAUSA',
    },
    {
      code: '25797',
      name: 'TENA',
    },
    {
      code: '25799',
      name: 'TENJO',
    },
    {
      code: '25805',
      name: 'TIBACUY',
    },
    {
      code: '25807',
      name: 'TIBIRITA',
    },
    {
      code: '25815',
      name: 'TOCAIMA',
    },
    {
      code: '25817',
      name: 'TOCANCIPÁ',
    },
    {
      code: '25823',
      name: 'TOPAIPÍ',
    },
    {
      code: '25839',
      name: 'UBALÁ',
    },
    {
      code: '25841',
      name: 'UBAQUE',
    },
    {
      code: '25843',
      name: 'VILLA DE SAN DIEGO DE UBATÉ',
    },
    {
      code: '25845',
      name: 'UNE',
    },
    {
      code: '25851',
      name: 'ÚTICA',
    },
    {
      code: '25862',
      name: 'VERGARA',
    },
    {
      code: '25867',
      name: 'VIANÍ',
    },
    {
      code: '25871',
      name: 'VILLAGÓMEZ',
    },
    {
      code: '25873',
      name: 'VILLAPINZÓN',
    },
    {
      code: '25875',
      name: 'VILLETA',
    },
    {
      code: '25878',
      name: 'VIOTÁ',
    },
    {
      code: '25885',
      name: 'YACOPÍ',
    },
    {
      code: '25898',
      name: 'ZIPACÓN',
    },
    {
      code: '25899',
      name: 'ZIPAQUIRÁ',
    },
    {
      code: '27001',
      name: 'QUIBDÓ',
    },
    {
      code: '27006',
      name: 'ACANDÍ',
    },
    {
      code: '27025',
      name: 'ALTO BAUDÓ',
    },
    {
      code: '27050',
      name: 'ATRATO',
    },
    {
      code: '27073',
      name: 'BAGADÓ',
    },
    {
      code: '27075',
      name: 'BAHÍA SOLANO',
    },
    {
      code: '27077',
      name: 'BAJO BAUDÓ',
    },
    {
      code: '27099',
      name: 'BOJAYÁ',
    },
    {
      code: '27135',
      name: 'EL CANTÓN DEL SAN PABLO',
    },
    {
      code: '27150',
      name: 'CARMEN DEL DARIÉN',
    },
    {
      code: '27160',
      name: 'CÉRTEGUI',
    },
    {
      code: '27205',
      name: 'CONDOTO',
    },
    {
      code: '27245',
      name: 'EL CARMEN DE ATRATO',
    },
    {
      code: '27250',
      name: 'EL LITORAL DEL SAN JUAN',
    },
    {
      code: '27361',
      name: 'ISTMINA',
    },
    {
      code: '27372',
      name: 'JURADÓ',
    },
    {
      code: '27413',
      name: 'LLORÓ',
    },
    {
      code: '27425',
      name: 'MEDIO ATRATO',
    },
    {
      code: '27430',
      name: 'MEDIO BAUDÓ',
    },
    {
      code: '27450',
      name: 'MEDIO SAN JUAN',
    },
    {
      code: '27491',
      name: 'NÓVITA',
    },
    {
      code: '27495',
      name: 'NUQUÍ',
    },
    {
      code: '27580',
      name: 'RÍO IRÓ',
    },
    {
      code: '27600',
      name: 'RÍO QUITO',
    },
    {
      code: '27615',
      name: 'RIOSUCIO',
    },
    {
      code: '27660',
      name: 'SAN JOSÉ DEL PALMAR',
    },
    {
      code: '27745',
      name: 'SIPÍ',
    },
    {
      code: '27787',
      name: 'TADÓ',
    },
    {
      code: '27800',
      name: 'UNGUÍA',
    },
    {
      code: '27810',
      name: 'UNIÓN PANAMERICANA',
    },
    {
      code: '41001',
      name: 'NEIVA',
    },
    {
      code: '41006',
      name: 'ACEVEDO',
    },
    {
      code: '41013',
      name: 'AGRADO',
    },
    {
      code: '41016',
      name: 'AIPE',
    },
    {
      code: '41020',
      name: 'ALGECIRAS',
    },
    {
      code: '41026',
      name: 'ALTAMIRA',
    },
    {
      code: '41078',
      name: 'BARAYA',
    },
    {
      code: '41132',
      name: 'CAMPOALEGRE',
    },
    {
      code: '41206',
      name: 'COLOMBIA',
    },
    {
      code: '41244',
      name: 'ELÍAS',
    },
    {
      code: '41298',
      name: 'GARZÓN',
    },
    {
      code: '41306',
      name: 'GIGANTE',
    },
    {
      code: '41319',
      name: 'GUADALUPE',
    },
    {
      code: '41349',
      name: 'HOBO',
    },
    {
      code: '41357',
      name: 'ÍQUIRA',
    },
    {
      code: '41359',
      name: 'ISNOS',
    },
    {
      code: '41378',
      name: 'LA ARGENTINA',
    },
    {
      code: '41396',
      name: 'LA PLATA',
    },
    {
      code: '41483',
      name: 'NÁTAGA',
    },
    {
      code: '41503',
      name: 'OPORAPA',
    },
    {
      code: '41518',
      name: 'PAICOL',
    },
    {
      code: '41524',
      name: 'PALERMO',
    },
    {
      code: '41530',
      name: 'PALESTINA',
    },
    {
      code: '41548',
      name: 'PITAL',
    },
    {
      code: '41551',
      name: 'PITALITO',
    },
    {
      code: '41615',
      name: 'RIVERA',
    },
    {
      code: '41660',
      name: 'SALADOBLANCO',
    },
    {
      code: '41668',
      name: 'SAN AGUSTÍN',
    },
    {
      code: '41676',
      name: 'SANTA MARÍA',
    },
    {
      code: '41770',
      name: 'SUAZA',
    },
    {
      code: '41791',
      name: 'TARQUI',
    },
    {
      code: '41797',
      name: 'TESALIA',
    },
    {
      code: '41799',
      name: 'TELLO',
    },
    {
      code: '41801',
      name: 'TERUEL',
    },
    {
      code: '41807',
      name: 'TIMANÁ',
    },
    {
      code: '41872',
      name: 'VILLAVIEJA',
    },
    {
      code: '41885',
      name: 'YAGUARÁ',
    },
    {
      code: '44001',
      name: 'RIOHACHA',
    },
    {
      code: '44035',
      name: 'ALBANIA',
    },
    {
      code: '44078',
      name: 'BARRANCAS',
    },
    {
      code: '44090',
      name: 'DIBULLA',
    },
    {
      code: '44098',
      name: 'DISTRACCIÓN',
    },
    {
      code: '44110',
      name: 'EL MOLINO',
    },
    {
      code: '44279',
      name: 'FONSECA',
    },
    {
      code: '44378',
      name: 'HATONUEVO',
    },
    {
      code: '44420',
      name: 'LA JAGUA DEL PILAR',
    },
    {
      code: '44430',
      name: 'MAICAO',
    },
    {
      code: '44560',
      name: 'MANAURE',
    },
    {
      code: '44650',
      name: 'SAN JUAN DEL CESAR',
    },
    {
      code: '44847',
      name: 'URIBIA',
    },
    {
      code: '44855',
      name: 'URUMITA',
    },
    {
      code: '44874',
      name: 'VILLANUEVA',
    },
    {
      code: '47001',
      name: 'SANTA MARTA',
    },
    {
      code: '47030',
      name: 'ALGARROBO',
    },
    {
      code: '47053',
      name: 'ARACATACA',
    },
    {
      code: '47058',
      name: 'ARIGUANÍ',
    },
    {
      code: '47161',
      name: 'CERRO DE SAN ANTONIO',
    },
    {
      code: '47170',
      name: 'CHIVOLO',
    },
    {
      code: '47189',
      name: 'CIÉNAGA',
    },
    {
      code: '47205',
      name: 'CONCORDIA',
    },
    {
      code: '47245',
      name: 'EL BANCO',
    },
    {
      code: '47258',
      name: 'EL PIÑÓN',
    },
    {
      code: '47268',
      name: 'EL RETÉN',
    },
    {
      code: '47288',
      name: 'FUNDACIÓN',
    },
    {
      code: '47318',
      name: 'GUAMAL',
    },
    {
      code: '47460',
      name: 'NUEVA GRANADA',
    },
    {
      code: '47541',
      name: 'PEDRAZA',
    },
    {
      code: '47545',
      name: 'PIJIÑO DEL CARMEN',
    },
    {
      code: '47551',
      name: 'PIVIJAY',
    },
    {
      code: '47555',
      name: 'PLATO',
    },
    {
      code: '47570',
      name: 'PUEBLOVIEJO',
    },
    {
      code: '47605',
      name: 'REMOLINO',
    },
    {
      code: '47660',
      name: 'SABANAS DE SAN ÁNGEL',
    },
    {
      code: '47675',
      name: 'SALAMINA',
    },
    {
      code: '47692',
      name: 'SAN SEBASTIÁN DE BUENAVISTA',
    },
    {
      code: '47703',
      name: 'SAN ZENÓN',
    },
    {
      code: '47707',
      name: 'SANTA ANA',
    },
    {
      code: '47720',
      name: 'SANTA BÁRBARA DE PINTO',
    },
    {
      code: '47745',
      name: 'SITIONUEVO',
    },
    {
      code: '47798',
      name: 'TENERIFE',
    },
    {
      code: '47960',
      name: 'ZAPAYÁN',
    },
    {
      code: '47980',
      name: 'ZONA BANANERA',
    },
    {
      code: '50001',
      name: 'VILLAVICENCIO',
    },
    {
      code: '50006',
      name: 'ACACÍAS',
    },
    {
      code: '50110',
      name: 'BARRANCA DE UPÍA',
    },
    {
      code: '50124',
      name: 'CABUYARO',
    },
    {
      code: '50150',
      name: 'CASTILLA LA NUEVA',
    },
    {
      code: '50223',
      name: 'CUBARRAL',
    },
    {
      code: '50226',
      name: 'CUMARAL',
    },
    {
      code: '50245',
      name: 'EL CALVARIO',
    },
    {
      code: '50251',
      name: 'EL CASTILLO',
    },
    {
      code: '50270',
      name: 'EL DORADO',
    },
    {
      code: '50287',
      name: 'FUENTE DE ORO',
    },
    {
      code: '50313',
      name: 'GRANADA',
    },
    {
      code: '50318',
      name: 'GUAMAL',
    },
    {
      code: '50325',
      name: 'MAPIRIPÁN',
    },
    {
      code: '50330',
      name: 'MESETAS',
    },
    {
      code: '50350',
      name: 'LA MACARENA',
    },
    {
      code: '50370',
      name: 'URIBE',
    },
    {
      code: '50400',
      name: 'LEJANÍAS',
    },
    {
      code: '50450',
      name: 'PUERTO CONCORDIA',
    },
    {
      code: '50568',
      name: 'PUERTO GAITÁN',
    },
    {
      code: '50573',
      name: 'PUERTO LÓPEZ',
    },
    {
      code: '50577',
      name: 'PUERTO LLERAS',
    },
    {
      code: '50590',
      name: 'PUERTO RICO',
    },
    {
      code: '50606',
      name: 'RESTREPO',
    },
    {
      code: '50680',
      name: 'SAN CARLOS DE GUAROA',
    },
    {
      code: '50683',
      name: 'SAN JUAN DE ARAMA',
    },
    {
      code: '50686',
      name: 'SAN JUANITO',
    },
    {
      code: '50689',
      name: 'SAN MARTÍN',
    },
    {
      code: '50711',
      name: 'VISTAHERMOSA',
    },
    {
      code: '52001',
      name: 'PASTO',
    },
    {
      code: '52019',
      name: 'ALBÁN',
    },
    {
      code: '52022',
      name: 'ALDANA',
    },
    {
      code: '52036',
      name: 'ANCUYA',
    },
    {
      code: '52051',
      name: 'ARBOLEDA',
    },
    {
      code: '52079',
      name: 'BARBACOAS',
    },
    {
      code: '52083',
      name: 'BELÉN',
    },
    {
      code: '52110',
      name: 'BUESACO',
    },
    {
      code: '52203',
      name: 'COLÓN',
    },
    {
      code: '52207',
      name: 'CONSACÁ',
    },
    {
      code: '52210',
      name: 'CONTADERO',
    },
    {
      code: '52215',
      name: 'CÓRDOBA',
    },
    {
      code: '52224',
      name: 'CUASPUD CARLOSAMA',
    },
    {
      code: '52227',
      name: 'CUMBAL',
    },
    {
      code: '52233',
      name: 'CUMBITARA',
    },
    {
      code: '52240',
      name: 'CHACHAGÜÍ',
    },
    {
      code: '52250',
      name: 'EL CHARCO',
    },
    {
      code: '52254',
      name: 'EL PEÑOL',
    },
    {
      code: '52256',
      name: 'EL ROSARIO',
    },
    {
      code: '52258',
      name: 'EL TABLÓN DE GÓMEZ',
    },
    {
      code: '52260',
      name: 'EL TAMBO',
    },
    {
      code: '52287',
      name: 'FUNES',
    },
    {
      code: '52317',
      name: 'GUACHUCAL',
    },
    {
      code: '52320',
      name: 'GUAITARILLA',
    },
    {
      code: '52323',
      name: 'GUALMATÁN',
    },
    {
      code: '52352',
      name: 'ILES',
    },
    {
      code: '52354',
      name: 'IMUÉS',
    },
    {
      code: '52356',
      name: 'IPIALES',
    },
    {
      code: '52378',
      name: 'LA CRUZ',
    },
    {
      code: '52381',
      name: 'LA FLORIDA',
    },
    {
      code: '52385',
      name: 'LA LLANADA',
    },
    {
      code: '52390',
      name: 'LA TOLA',
    },
    {
      code: '52399',
      name: 'LA UNIÓN',
    },
    {
      code: '52405',
      name: 'LEIVA',
    },
    {
      code: '52411',
      name: 'LINARES',
    },
    {
      code: '52418',
      name: 'LOS ANDES',
    },
    {
      code: '52427',
      name: 'MAGÜÍ',
    },
    {
      code: '52435',
      name: 'MALLAMA',
    },
    {
      code: '52473',
      name: 'MOSQUERA',
    },
    {
      code: '52480',
      name: 'NARIÑO',
    },
    {
      code: '52490',
      name: 'OLAYA HERRERA',
    },
    {
      code: '52506',
      name: 'OSPINA',
    },
    {
      code: '52520',
      name: 'FRANCISCO PIZARRO',
    },
    {
      code: '52540',
      name: 'POLICARPA',
    },
    {
      code: '52560',
      name: 'POTOSÍ',
    },
    {
      code: '52565',
      name: 'PROVIDENCIA',
    },
    {
      code: '52573',
      name: 'PUERRES',
    },
    {
      code: '52585',
      name: 'PUPIALES',
    },
    {
      code: '52612',
      name: 'RICAURTE',
    },
    {
      code: '52621',
      name: 'ROBERTO PAYÁN',
    },
    {
      code: '52678',
      name: 'SAMANIEGO',
    },
    {
      code: '52683',
      name: 'SANDONÁ',
    },
    {
      code: '52685',
      name: 'SAN BERNARDO',
    },
    {
      code: '52687',
      name: 'SAN LORENZO',
    },
    {
      code: '52693',
      name: 'SAN PABLO',
    },
    {
      code: '52694',
      name: 'SAN PEDRO DE CARTAGO',
    },
    {
      code: '52696',
      name: 'SANTA BÁRBARA',
    },
    {
      code: '52699',
      name: 'SANTACRUZ',
    },
    {
      code: '52720',
      name: 'SAPUYES',
    },
    {
      code: '52786',
      name: 'TAMINANGO',
    },
    {
      code: '52788',
      name: 'TANGUA',
    },
    {
      code: '52835',
      name: 'SAN ANDRÉS DE TUMACO',
    },
    {
      code: '52838',
      name: 'TÚQUERRES',
    },
    {
      code: '52885',
      name: 'YACUANQUER',
    },
    {
      code: '54001',
      name: 'SAN JOSÉ DE CÚCUTA',
    },
    {
      code: '54003',
      name: 'ÁBREGO',
    },
    {
      code: '54051',
      name: 'ARBOLEDAS',
    },
    {
      code: '54099',
      name: 'BOCHALEMA',
    },
    {
      code: '54109',
      name: 'BUCARASICA',
    },
    {
      code: '54125',
      name: 'CÁCOTA',
    },
    {
      code: '54128',
      name: 'CÁCHIRA',
    },
    {
      code: '54172',
      name: 'CHINÁCOTA',
    },
    {
      code: '54174',
      name: 'CHITAGÁ',
    },
    {
      code: '54206',
      name: 'CONVENCIÓN',
    },
    {
      code: '54223',
      name: 'CUCUTILLA',
    },
    {
      code: '54239',
      name: 'DURANIA',
    },
    {
      code: '54245',
      name: 'EL CARMEN',
    },
    {
      code: '54250',
      name: 'EL TARRA',
    },
    {
      code: '54261',
      name: 'EL ZULIA',
    },
    {
      code: '54313',
      name: 'GRAMALOTE',
    },
    {
      code: '54344',
      name: 'HACARÍ',
    },
    {
      code: '54347',
      name: 'HERRÁN',
    },
    {
      code: '54377',
      name: 'LABATECA',
    },
    {
      code: '54385',
      name: 'LA ESPERANZA',
    },
    {
      code: '54398',
      name: 'LA PLAYA',
    },
    {
      code: '54405',
      name: 'LOS PATIOS',
    },
    {
      code: '54418',
      name: 'LOURDES',
    },
    {
      code: '54480',
      name: 'MUTISCUA',
    },
    {
      code: '54498',
      name: 'OCAÑA',
    },
    {
      code: '54518',
      name: 'PAMPLONA',
    },
    {
      code: '54520',
      name: 'PAMPLONITA',
    },
    {
      code: '54553',
      name: 'PUERTO SANTANDER',
    },
    {
      code: '54599',
      name: 'RAGONVALIA',
    },
    {
      code: '54660',
      name: 'SALAZAR',
    },
    {
      code: '54670',
      name: 'SAN CALIXTO',
    },
    {
      code: '54673',
      name: 'SAN CAYETANO',
    },
    {
      code: '54680',
      name: 'SANTIAGO',
    },
    {
      code: '54720',
      name: 'SARDINATA',
    },
    {
      code: '54743',
      name: 'SILOS',
    },
    {
      code: '54800',
      name: 'TEORAMA',
    },
    {
      code: '54810',
      name: 'TIBÚ',
    },
    {
      code: '54820',
      name: 'TOLEDO',
    },
    {
      code: '54871',
      name: 'VILLA CARO',
    },
    {
      code: '54874',
      name: 'VILLA DEL ROSARIO',
    },
    {
      code: '63001',
      name: 'ARMENIA',
    },
    {
      code: '63111',
      name: 'BUENAVISTA',
    },
    {
      code: '63130',
      name: 'CALARCÁ',
    },
    {
      code: '63190',
      name: 'CIRCASIA',
    },
    {
      code: '63212',
      name: 'CÓRDOBA',
    },
    {
      code: '63272',
      name: 'FILANDIA',
    },
    {
      code: '63302',
      name: 'GÉNOVA',
    },
    {
      code: '63401',
      name: 'LA TEBAIDA',
    },
    {
      code: '63470',
      name: 'MONTENEGRO',
    },
    {
      code: '63548',
      name: 'PIJAO',
    },
    {
      code: '63594',
      name: 'QUIMBAYA',
    },
    {
      code: '63690',
      name: 'SALENTO',
    },
    {
      code: '66001',
      name: 'PEREIRA',
    },
    {
      code: '66045',
      name: 'APÍA',
    },
    {
      code: '66075',
      name: 'BALBOA',
    },
    {
      code: '66088',
      name: 'BELÉN DE UMBRÍA',
    },
    {
      code: '66170',
      name: 'DOSQUEBRADAS',
    },
    {
      code: '66318',
      name: 'GUÁTICA',
    },
    {
      code: '66383',
      name: 'LA CELIA',
    },
    {
      code: '66400',
      name: 'LA VIRGINIA',
    },
    {
      code: '66440',
      name: 'MARSELLA',
    },
    {
      code: '66456',
      name: 'MISTRATÓ',
    },
    {
      code: '66572',
      name: 'PUEBLO RICO',
    },
    {
      code: '66594',
      name: 'QUINCHÍA',
    },
    {
      code: '66682',
      name: 'SANTA ROSA DE CABAL',
    },
    {
      code: '66687',
      name: 'SANTUARIO',
    },
    {
      code: '68001',
      name: 'BUCARAMANGA',
    },
    {
      code: '68013',
      name: 'AGUADA',
    },
    {
      code: '68020',
      name: 'ALBANIA',
    },
    {
      code: '68051',
      name: 'ARATOCA',
    },
    {
      code: '68077',
      name: 'BARBOSA',
    },
    {
      code: '68079',
      name: 'BARICHARA',
    },
    {
      code: '68081',
      name: 'BARRANCABERMEJA',
    },
    {
      code: '68092',
      name: 'BETULIA',
    },
    {
      code: '68101',
      name: 'BOLÍVAR',
    },
    {
      code: '68121',
      name: 'CABRERA',
    },
    {
      code: '68132',
      name: 'CALIFORNIA',
    },
    {
      code: '68147',
      name: 'CAPITANEJO',
    },
    {
      code: '68152',
      name: 'CARCASÍ',
    },
    {
      code: '68160',
      name: 'CEPITÁ',
    },
    {
      code: '68162',
      name: 'CERRITO',
    },
    {
      code: '68167',
      name: 'CHARALÁ',
    },
    {
      code: '68169',
      name: 'CHARTA',
    },
    {
      code: '68176',
      name: 'CHIMA',
    },
    {
      code: '68179',
      name: 'CHIPATÁ',
    },
    {
      code: '68190',
      name: 'CIMITARRA',
    },
    {
      code: '68207',
      name: 'CONCEPCIÓN',
    },
    {
      code: '68209',
      name: 'CONFINES',
    },
    {
      code: '68211',
      name: 'CONTRATACIÓN',
    },
    {
      code: '68217',
      name: 'COROMORO',
    },
    {
      code: '68229',
      name: 'CURITÍ',
    },
    {
      code: '68235',
      name: 'EL CARMEN DE CHUCURI',
    },
    {
      code: '68245',
      name: 'EL GUACAMAYO',
    },
    {
      code: '68250',
      name: 'EL PEÑÓN',
    },
    {
      code: '68255',
      name: 'EL PLAYÓN',
    },
    {
      code: '68264',
      name: 'ENCINO',
    },
    {
      code: '68266',
      name: 'ENCISO',
    },
    {
      code: '68271',
      name: 'FLORIÁN',
    },
    {
      code: '68276',
      name: 'FLORIDABLANCA',
    },
    {
      code: '68296',
      name: 'GALÁN',
    },
    {
      code: '68298',
      name: 'GÁMBITA',
    },
    {
      code: '68307',
      name: 'GIRÓN',
    },
    {
      code: '68318',
      name: 'GUACA',
    },
    {
      code: '68320',
      name: 'GUADALUPE',
    },
    {
      code: '68322',
      name: 'GUAPOTÁ',
    },
    {
      code: '68324',
      name: 'GUAVATÁ',
    },
    {
      code: '68327',
      name: 'GÜEPSA',
    },
    {
      code: '68344',
      name: 'HATO',
    },
    {
      code: '68368',
      name: 'JESÚS MARÍA',
    },
    {
      code: '68370',
      name: 'JORDÁN',
    },
    {
      code: '68377',
      name: 'LA BELLEZA',
    },
    {
      code: '68385',
      name: 'LANDÁZURI',
    },
    {
      code: '68397',
      name: 'LA PAZ',
    },
    {
      code: '68406',
      name: 'LEBRIJA',
    },
    {
      code: '68418',
      name: 'LOS SANTOS',
    },
    {
      code: '68425',
      name: 'MACARAVITA',
    },
    {
      code: '68432',
      name: 'MÁLAGA',
    },
    {
      code: '68444',
      name: 'MATANZA',
    },
    {
      code: '68464',
      name: 'MOGOTES',
    },
    {
      code: '68468',
      name: 'MOLAGAVITA',
    },
    {
      code: '68498',
      name: 'OCAMONTE',
    },
    {
      code: '68500',
      name: 'OIBA',
    },
    {
      code: '68502',
      name: 'ONZAGA',
    },
    {
      code: '68522',
      name: 'PALMAR',
    },
    {
      code: '68524',
      name: 'PALMAS DEL SOCORRO',
    },
    {
      code: '68533',
      name: 'PÁRAMO',
    },
    {
      code: '68547',
      name: 'PIEDECUESTA',
    },
    {
      code: '68549',
      name: 'PINCHOTE',
    },
    {
      code: '68572',
      name: 'PUENTE NACIONAL',
    },
    {
      code: '68573',
      name: 'PUERTO PARRA',
    },
    {
      code: '68575',
      name: 'PUERTO WILCHES',
    },
    {
      code: '68615',
      name: 'RIONEGRO',
    },
    {
      code: '68655',
      name: 'SABANA DE TORRES',
    },
    {
      code: '68669',
      name: 'SAN ANDRÉS',
    },
    {
      code: '68673',
      name: 'SAN BENITO',
    },
    {
      code: '68679',
      name: 'SAN GIL',
    },
    {
      code: '68682',
      name: 'SAN JOAQUÍN',
    },
    {
      code: '68684',
      name: 'SAN JOSÉ DE MIRANDA',
    },
    {
      code: '68686',
      name: 'SAN MIGUEL',
    },
    {
      code: '68689',
      name: 'SAN VICENTE DE CHUCURÍ',
    },
    {
      code: '68705',
      name: 'SANTA BÁRBARA',
    },
    {
      code: '68720',
      name: 'SANTA HELENA DEL OPÓN',
    },
    {
      code: '68745',
      name: 'SIMACOTA',
    },
    {
      code: '68755',
      name: 'SOCORRO',
    },
    {
      code: '68770',
      name: 'SUAITA',
    },
    {
      code: '68773',
      name: 'SUCRE',
    },
    {
      code: '68780',
      name: 'SURATÁ',
    },
    {
      code: '68820',
      name: 'TONA',
    },
    {
      code: '68855',
      name: 'VALLE DE SAN JOSÉ',
    },
    {
      code: '68861',
      name: 'VÉLEZ',
    },
    {
      code: '68867',
      name: 'VETAS',
    },
    {
      code: '68872',
      name: 'VILLANUEVA',
    },
    {
      code: '68895',
      name: 'ZAPATOCA',
    },
    {
      code: '70001',
      name: 'SINCELEJO',
    },
    {
      code: '70110',
      name: 'BUENAVISTA',
    },
    {
      code: '70124',
      name: 'CAIMITO',
    },
    {
      code: '70204',
      name: 'COLOSÓ',
    },
    {
      code: '70215',
      name: 'COROZAL',
    },
    {
      code: '70221',
      name: 'COVEÑAS',
    },
    {
      code: '70230',
      name: 'CHALÁN',
    },
    {
      code: '70233',
      name: 'EL ROBLE',
    },
    {
      code: '70235',
      name: 'GALERAS',
    },
    {
      code: '70265',
      name: 'GUARANDA',
    },
    {
      code: '70400',
      name: 'LA UNIÓN',
    },
    {
      code: '70418',
      name: 'LOS PALMITOS',
    },
    {
      code: '70429',
      name: 'MAJAGUAL',
    },
    {
      code: '70473',
      name: 'MORROA',
    },
    {
      code: '70508',
      name: 'OVEJAS',
    },
    {
      code: '70523',
      name: 'PALMITO',
    },
    {
      code: '70670',
      name: 'SAMPUÉS',
    },
    {
      code: '70678',
      name: 'SAN BENITO ABAD',
    },
    {
      code: '70702',
      name: 'SAN JUAN DE BETULIA',
    },
    {
      code: '70708',
      name: 'SAN MARCOS',
    },
    {
      code: '70713',
      name: 'SAN ONOFRE',
    },
    {
      code: '70717',
      name: 'SAN PEDRO',
    },
    {
      code: '70742',
      name: 'SAN LUIS DE SINCÉ',
    },
    {
      code: '70771',
      name: 'SUCRE',
    },
    {
      code: '70820',
      name: 'SANTIAGO DE TOLÚ',
    },
    {
      code: '70823',
      name: 'SAN JOSÉ DE TOLUVIEJO',
    },
    {
      code: '73001',
      name: 'IBAGUÉ',
    },
    {
      code: '73024',
      name: 'ALPUJARRA',
    },
    {
      code: '73026',
      name: 'ALVARADO',
    },
    {
      code: '73030',
      name: 'AMBALEMA',
    },
    {
      code: '73043',
      name: 'ANZOÁTEGUI',
    },
    {
      code: '73055',
      name: 'ARMERO',
    },
    {
      code: '73067',
      name: 'ATACO',
    },
    {
      code: '73124',
      name: 'CAJAMARCA',
    },
    {
      code: '73148',
      name: 'CARMEN DE APICALÁ',
    },
    {
      code: '73152',
      name: 'CASABIANCA',
    },
    {
      code: '73168',
      name: 'CHAPARRAL',
    },
    {
      code: '73200',
      name: 'COELLO',
    },
    {
      code: '73217',
      name: 'COYAIMA',
    },
    {
      code: '73226',
      name: 'CUNDAY',
    },
    {
      code: '73236',
      name: 'DOLORES',
    },
    {
      code: '73268',
      name: 'ESPINAL',
    },
    {
      code: '73270',
      name: 'FALAN',
    },
    {
      code: '73275',
      name: 'FLANDES',
    },
    {
      code: '73283',
      name: 'FRESNO',
    },
    {
      code: '73319',
      name: 'GUAMO',
    },
    {
      code: '73347',
      name: 'HERVEO',
    },
    {
      code: '73349',
      name: 'HONDA',
    },
    {
      code: '73352',
      name: 'ICONONZO',
    },
    {
      code: '73408',
      name: 'LÉRIDA',
    },
    {
      code: '73411',
      name: 'LÍBANO',
    },
    {
      code: '73443',
      name: 'SAN SEBASTIÁN DE MARIQUITA',
    },
    {
      code: '73449',
      name: 'MELGAR',
    },
    {
      code: '73461',
      name: 'MURILLO',
    },
    {
      code: '73483',
      name: 'NATAGAIMA',
    },
    {
      code: '73504',
      name: 'ORTEGA',
    },
    {
      code: '73520',
      name: 'PALOCABILDO',
    },
    {
      code: '73547',
      name: 'PIEDRAS',
    },
    {
      code: '73555',
      name: 'PLANADAS',
    },
    {
      code: '73563',
      name: 'PRADO',
    },
    {
      code: '73585',
      name: 'PURIFICACIÓN',
    },
    {
      code: '73616',
      name: 'RIOBLANCO',
    },
    {
      code: '73622',
      name: 'RONCESVALLES',
    },
    {
      code: '73624',
      name: 'ROVIRA',
    },
    {
      code: '73671',
      name: 'SALDAÑA',
    },
    {
      code: '73675',
      name: 'SAN ANTONIO',
    },
    {
      code: '73678',
      name: 'SAN LUIS',
    },
    {
      code: '73686',
      name: 'SANTA ISABEL',
    },
    {
      code: '73770',
      name: 'SUÁREZ',
    },
    {
      code: '73854',
      name: 'VALLE DE SAN JUAN',
    },
    {
      code: '73861',
      name: 'VENADILLO',
    },
    {
      code: '73870',
      name: 'VILLAHERMOSA',
    },
    {
      code: '73873',
      name: 'VILLARRICA',
    },
    {
      code: '76001',
      name: 'CALI',
    },
    {
      code: '76020',
      name: 'ALCALÁ',
    },
    {
      code: '76036',
      name: 'ANDALUCÍA',
    },
    {
      code: '76041',
      name: 'ANSERMANUEVO',
    },
    {
      code: '76054',
      name: 'ARGELIA',
    },
    {
      code: '76100',
      name: 'BOLÍVAR',
    },
    {
      code: '76109',
      name: 'BUENAVENTURA',
    },
    {
      code: '76111',
      name: 'GUADALAJARA DE BUGA',
    },
    {
      code: '76113',
      name: 'BUGALAGRANDE',
    },
    {
      code: '76122',
      name: 'CAICEDONIA',
    },
    {
      code: '76126',
      name: 'CALIMA',
    },
    {
      code: '76130',
      name: 'CANDELARIA',
    },
    {
      code: '76147',
      name: 'CARTAGO',
    },
    {
      code: '76233',
      name: 'DAGUA',
    },
    {
      code: '76243',
      name: 'EL ÁGUILA',
    },
    {
      code: '76246',
      name: 'EL CAIRO',
    },
    {
      code: '76248',
      name: 'EL CERRITO',
    },
    {
      code: '76250',
      name: 'EL DOVIO',
    },
    {
      code: '76275',
      name: 'FLORIDA',
    },
    {
      code: '76306',
      name: 'GINEBRA',
    },
    {
      code: '76318',
      name: 'GUACARÍ',
    },
    {
      code: '76364',
      name: 'JAMUNDÍ',
    },
    {
      code: '76377',
      name: 'LA CUMBRE',
    },
    {
      code: '76400',
      name: 'LA UNIÓN',
    },
    {
      code: '76403',
      name: 'LA VICTORIA',
    },
    {
      code: '76497',
      name: 'OBANDO',
    },
    {
      code: '76520',
      name: 'PALMIRA',
    },
    {
      code: '76563',
      name: 'PRADERA',
    },
    {
      code: '76606',
      name: 'RESTREPO',
    },
    {
      code: '76616',
      name: 'RIOFRÍO',
    },
    {
      code: '76622',
      name: 'ROLDANILLO',
    },
    {
      code: '76670',
      name: 'SAN PEDRO',
    },
    {
      code: '76736',
      name: 'SEVILLA',
    },
    {
      code: '76823',
      name: 'TORO',
    },
    {
      code: '76828',
      name: 'TRUJILLO',
    },
    {
      code: '76834',
      name: 'TULUÁ',
    },
    {
      code: '76845',
      name: 'ULLOA',
    },
    {
      code: '76863',
      name: 'VERSALLES',
    },
    {
      code: '76869',
      name: 'VIJES',
    },
    {
      code: '76890',
      name: 'YOTOCO',
    },
    {
      code: '76892',
      name: 'YUMBO',
    },
    {
      code: '76895',
      name: 'ZARZAL',
    },
    {
      code: '81001',
      name: 'ARAUCA',
    },
    {
      code: '81065',
      name: 'ARAUQUITA',
    },
    {
      code: '81220',
      name: 'CRAVO NORTE',
    },
    {
      code: '81300',
      name: 'FORTUL',
    },
    {
      code: '81591',
      name: 'PUERTO RONDÓN',
    },
    {
      code: '81736',
      name: 'SARAVENA',
    },
    {
      code: '81794',
      name: 'TAME',
    },
    {
      code: '85001',
      name: 'YOPAL',
    },
    {
      code: '85010',
      name: 'AGUAZUL',
    },
    {
      code: '85015',
      name: 'CHÁMEZA',
    },
    {
      code: '85125',
      name: 'HATO COROZAL',
    },
    {
      code: '85136',
      name: 'LA SALINA',
    },
    {
      code: '85139',
      name: 'MANÍ',
    },
    {
      code: '85162',
      name: 'MONTERREY',
    },
    {
      code: '85225',
      name: 'NUNCHÍA',
    },
    {
      code: '85230',
      name: 'OROCUÉ',
    },
    {
      code: '85250',
      name: 'PAZ DE ARIPORO',
    },
    {
      code: '85263',
      name: 'PORE',
    },
    {
      code: '85279',
      name: 'RECETOR',
    },
    {
      code: '85300',
      name: 'SABANALARGA',
    },
    {
      code: '85315',
      name: 'SÁCAMA',
    },
    {
      code: '85325',
      name: 'SAN LUIS DE PALENQUE',
    },
    {
      code: '85400',
      name: 'TÁMARA',
    },
    {
      code: '85410',
      name: 'TAURAMENA',
    },
    {
      code: '85430',
      name: 'TRINIDAD',
    },
    {
      code: '85440',
      name: 'VILLANUEVA',
    },
    {
      code: '86001',
      name: 'MOCOA',
    },
    {
      code: '86219',
      name: 'COLÓN',
    },
    {
      code: '86320',
      name: 'ORITO',
    },
    {
      code: '86568',
      name: 'PUERTO ASÍS',
    },
    {
      code: '86569',
      name: 'PUERTO CAICEDO',
    },
    {
      code: '86571',
      name: 'PUERTO GUZMÁN',
    },
    {
      code: '86573',
      name: 'PUERTO LEGUÍZAMO',
    },
    {
      code: '86749',
      name: 'SIBUNDOY',
    },
    {
      code: '86755',
      name: 'SAN FRANCISCO',
    },
    {
      code: '86757',
      name: 'SAN MIGUEL',
    },
    {
      code: '86760',
      name: 'SANTIAGO',
    },
    {
      code: '86865',
      name: 'VALLE DEL GUAMUEZ',
    },
    {
      code: '86885',
      name: 'VILLAGARZÓN',
    },
    {
      code: '88001',
      name: 'SAN ANDRÉS',
    },
    {
      code: '88564',
      name: 'PROVIDENCIA',
    },
    {
      code: '91001',
      name: 'LETICIA',
    },
    {
      code: '91263',
      name: 'EL ENCANTO',
    },
    {
      code: '91405',
      name: 'LA CHORRERA',
    },
    {
      code: '91407',
      name: 'LA PEDRERA',
    },
    {
      code: '91430',
      name: 'LA VICTORIA',
    },
    {
      code: '91460',
      name: 'MIRITÍ - PARANÁ',
    },
    {
      code: '91530',
      name: 'PUERTO ALEGRÍA',
    },
    {
      code: '91536',
      name: 'PUERTO ARICA',
    },
    {
      code: '91540',
      name: 'PUERTO NARIÑO',
    },
    {
      code: '91669',
      name: 'PUERTO SANTANDER',
    },
    {
      code: '91798',
      name: 'TARAPACÁ',
    },
    {
      code: '94001',
      name: 'INÍRIDA',
    },
    {
      code: '94343',
      name: 'BARRANCOMINAS',
    },
    {
      code: '94883',
      name: 'SAN FELIPE',
    },
    {
      code: '94884',
      name: 'PUERTO COLOMBIA',
    },
    {
      code: '94885',
      name: 'LA GUADALUPE',
    },
    {
      code: '94886',
      name: 'CACAHUAL',
    },
    {
      code: '94887',
      name: 'PANA PANA',
    },
    {
      code: '94888',
      name: 'MORICHAL',
    },
    {
      code: '95001',
      name: 'SAN JOSÉ DEL GUAVIARE',
    },
    {
      code: '95015',
      name: 'CALAMAR',
    },
    {
      code: '95025',
      name: 'EL RETORNO',
    },
    {
      code: '95200',
      name: 'MIRAFLORES',
    },
    {
      code: '97001',
      name: 'MITÚ',
    },
    {
      code: '97161',
      name: 'CARURÚ',
    },
    {
      code: '97511',
      name: 'PACOA',
    },
    {
      code: '97666',
      name: 'TARAIRA',
    },
    {
      code: '97777',
      name: 'PAPUNAHUA',
    },
    {
      code: '97889',
      name: 'YAVARATÉ',
    },
    {
      code: '99001',
      name: 'PUERTO CARREÑO',
    },
    {
      code: '99524',
      name: 'LA PRIMAVERA',
    },
    {
      code: '99624',
      name: 'SANTA ROSALÍA',
    },
    {
      code: '99773',
      name: 'CUMARIBO',
    },
  ] as NewCity[];

  return db.insert(cities).values(values);
}

async function seedSchools() {
  await db.delete(schools);

  const cityList = await db.select().from(cities);
  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          name: faker.word.noun(),
          cityId: faker.helpers.arrayElement(cityList).id,
          areaType: 'urban',
          daneCode: faker.string.sample(),
          branchCode: faker.string.sample(),
          sectorType: 'mixed',
          infrastructureCode: faker.string.sample(),
        }) satisfies NewSchool
    );
  return db.insert(schools).values(values);
}

async function seedProofFileClassifications() {
  await db.delete(proofFileClassifications);
  const values = Array(20)
    .fill('')
    .map(() => ({ name: faker.word.noun() }) satisfies NewProofFileClassification);
  return db.insert(proofFileClassifications).values(values);
}

async function seedIdentifications() {
  await db.delete(identifications);

  const values = [
    { id: 0,code: 'NO', name: 'No data' },
    { code: 'CC', name: 'Cédula de Ciudadanía' },
    { code: 'TI', name: 'Tarjeta de Identidad' },
    { code: 'RC', name: 'Registro Civil' },
    { code: 'CE', name: 'Cédula de Extranjería' },
    { code: 'NUIP', name: 'Número Único de Identificación Personal' },
    { code: 'PP', name: 'Pasaporte' },
    { code: 'NIT', name: 'Número de Identificación Tributaria' },
    { code: 'CD', name: 'Carne Diplomatico' },
    { code: 'PEP', name: 'Permiso Especial de Permanencia' },
    { code: 'CCC', name: 'Certificado cabildo' },
    { code: 'IS', name: 'Identificación dada por la Secretaría de Educación' },
    { code: 'TMF', name: 'Tarjeta de movilidad fronteriza' },
    { code: 'VIS', name: 'VISA' },
    { code: 'TE', name: 'Tarjeta de Extranjería' },
    { code: 'PET', name: 'Permiso Especial de Permanencia Temporal' },
    { code: 'DIE', name: 'Documento de Identificación Extranjero' },
    { code: 'FNIT', name: 'NIT de otro país' },
  ];
  return db.insert(identifications).values(values);
}

async function seedGuardians() {
  await db.delete(guardians);

  const identificationList = await db.select().from(identifications);

  const values = Array(30)
    .fill('')
    .map(
      () =>
        ({
          idNum: faker.string.uuid().slice(0, 20),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          identificationId: faker.helpers.arrayElement(identificationList).id,
        }) satisfies NewGuardian
    );
  return db.insert(guardians).values(values);
}

async function seedProfessionals() {
  await db.delete(professionals);

  const identificationList = await db.select().from(identifications);

  const values = Array(30)
    .fill('')
    .map(
      () =>
        ({
          idNum: faker.string.uuid().slice(0, 20),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          identificationId: faker.helpers.arrayElement(identificationList).id,
          authId: faker.helpers.rangeToNumber({ min: 1, max: 2000 }),
        }) satisfies NewProfessional
    );
  return db.insert(professionals).values(values);
}

async function seedChildren() {
  await db.delete(children);

  const guardianList = await db.select().from(guardians);
  const identificationList = await db.select().from(identifications);
  const cityList = await db.select().from(cities);
  const shiftList = await db.select().from(shifts);
  const stateList = await db.select().from(states);
  const genderList = await db.select().from(genders);
  const countryList = await db.select().from(countries);
  const vulnerabilityList = await db.select().from(vulnerabilityFactors);
  const ethnicityList = await db.select().from(ethnicities);
  const populationList = await db.select().from(populations);
  const schoolGradesList = await db.select().from(schoolGrades);
  const educationLevelList = await db.select().from(educationLevels);
  const beneficiaryTypeList = await db.select().from(beneficiaryTypes);
  const indigenousReservesList = await db.select().from(indigenousReserves);
  const indigenousCommunitiesList = await db.select().from(indigenousCommunities);

  const kinshipsList = await db.select().from(kinships);

  const values = Array(30)
    .fill('')
    .map(
      () =>
        ({
          idNum: faker.string.uuid().slice(0, 20),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          guardianId: faker.helpers.arrayElement(guardianList).id,
          identificationId: faker.helpers.arrayElement(identificationList).id,
          cityId: faker.helpers.arrayElement(cityList).id,
          shiftId: faker.helpers.arrayElement(shiftList).id,
          stateId: faker.helpers.arrayElement(stateList).id,
          areaType: 'urban',
          genderId: faker.helpers.arrayElement(genderList).id,
          address: faker.location.streetAddress(),
          countryId: faker.helpers.arrayElement(countryList).id,
          vulnerabilityFactorId: faker.helpers.arrayElement(vulnerabilityList).id,
          birthCityId: faker.helpers.arrayElement(cityList).id,
          ethnicityId: faker.helpers.arrayElement(ethnicityList).id,
          populationId: faker.helpers.arrayElement(populationList).id,
          birthStateId: faker.helpers.arrayElement(stateList).id,
          schoolGradeId: faker.helpers.arrayElement(schoolGradesList).id,
          educationLevelId: faker.helpers.arrayElement(educationLevelList).id,
          beneficiaryTypeId: faker.helpers.arrayElement(beneficiaryTypeList).id,
          birthDate: new Date(),
          affiliationDate: new Date(),
          indigenousReserveId: faker.helpers.arrayElement(indigenousReservesList).id,
          indigenousCommunityId: faker.helpers.arrayElement(indigenousCommunitiesList).id,
          kinshipId: faker.helpers.arrayElement(kinshipsList).id,
        }) satisfies NewChild
    );
  return db.insert(children).values(values);
}

async function seedPrograms() {
  await db.delete(programs);
  const values = Array(2)
    .fill('')
    .map(() => {
      return { name: faker.word.noun(), description: faker.lorem.lines(1) } satisfies NewProgram;
    });
  return db.insert(programs).values(values);
}

async function seedModalities() {
  await db.delete(modalities);

  const programList = await db.select().from(programs);
  const modalityTypeList = await db.select().from(modalityTypes);

  const values = Array(40)
    .fill('')
    .map(
      () =>
        ({
          name: faker.word.noun(),
          description: faker.lorem.lines(1),
          programId: faker.helpers.arrayElement(programList).id,
          modalityTypeId: faker.helpers.arrayElement(modalityTypeList).id,
        }) satisfies NewModality
    );
  return db.insert(modalities).values(values);
}

async function seedPlans() {
  await db.delete(plans);

  const programList = await db.select().from(programs);

  const values = Array(2)
    .fill('')
    .map(
      () =>
        ({
          year: faker.helpers.arrayElement([2023, 2024]),
          longTermObjective: faker.lorem.lines(1),
          shortTermObjective: faker.lorem.lines(1),
          justification: faker.lorem.lines(1),
          description: faker.lorem.lines(1),
          rejectionNote: faker.lorem.lines(1),
          status: faker.helpers.arrayElement([
            'draft',
            'pending review',
            'reviewed',
            'rejected',
            'approved',
          ]),
          programId: faker.helpers.arrayElement(programList).id,
        }) satisfies NewPlan
    );

  return db.insert(plans).values(values);
}

async function seedPlanModalities() {
  await db.delete(planModalities);

  const planList = await db.select().from(plans);
  const modalityList = await db.select().from(modalities);

  const values = modalityList.reduce((acc, cur, i) => {
    const plan = faker.helpers.arrayElement(planList);

    // Skip dupplicates
    if (acc.slice(0, i).some((mod) => mod.id === cur.id && mod.planId === plan.id)) {
      return acc;
    }

    const value = {
      planId: plan.id,
      modalityId: cur.id,
    } satisfies NewPlanModality;

    return (acc = acc.concat(value)), acc;
  }, [] as NewPlanModality[]);

  return db.insert(planModalities).values(values);
}

async function seedPlanModalityActivities() {
  await db.delete(planModalityActivities);

  const planModalityList = await db.select().from(planModalities);
  const serviciesList = await db.select().from(servicesAipi);

  const values = Array(20)
    .fill('')
    .map(() => {
      const planModality = faker.helpers.arrayElement(planModalityList);

      return {
        name: faker.company.name(),
        planModalityId: planModality.id,
        planId: planModality.planId,
        description: faker.lorem.sentences({ min: 1, max: 5 }),
        requiredProofOfCompletionCount: faker.helpers.rangeToNumber({ min: 1, max: 4 }),
        startDate: faker.date.future(),
        endDate: faker.date.future(),
        serviceAipiId: faker.helpers.arrayElement(serviciesList).id,
      } satisfies NewPlanModalityActivity;
    });

  return db.insert(planModalityActivities).values(values);
}

async function seedPlanModalityActivityResources() {
  await db.delete(planModalityActivityResources);

  const planModalityActivityList = await db.select().from(planModalityActivities);
  const resourceList = await db.select().from(resources);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          qty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
          planModalityActivityId: faker.helpers.arrayElement(planModalityActivityList).id,
          resourceId: faker.helpers.arrayElement(resourceList).id,
        }) satisfies NewPlanModalityActivityResource
    );

  return db.insert(planModalityActivityResources).values(values);
}

async function seedPlanModalityActivitySchools() {
  await db.delete(planModalityActivitySchools);

  const planModalityActivityList = await db.select().from(planModalityActivities);
  const schoolList = await db.select().from(schools);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          participantsQty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
          planModalityActivityId: faker.helpers.arrayElement(planModalityActivityList).id,
          schoolId: faker.helpers.arrayElement(schoolList).id,
          startDate: faker.date.future(),
          endDate: faker.date.future(),
          status: faker.helpers.arrayElement([
            'pending',
            'planning',
            'requested_resources',
            'confirmed_resources',
            'active',
            'completed',
          ]),
        }) satisfies NewPlanModalityActivitySchool
    );

  return db.insert(planModalityActivitySchools).values(values);
}

async function seedPlanModalityActivitySchoolResources() {
  await db.delete(planModalityActivitySchoolResources);

  const planModalityActivityResourceList = await db.select().from(planModalityActivityResources);
  const planModalityActivitySchoolList = await db.select().from(planModalityActivitySchools);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          planModalityActivityResourceId: faker.helpers.arrayElement(
            planModalityActivityResourceList
          ).id,
          planModalityActivitySchoolId: faker.helpers.arrayElement(planModalityActivitySchoolList)
            .id,
          resourcesQty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
          resourcesReceivedQty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
          resourcesUsedQty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
        }) satisfies NewPlanModalityActivitySchoolResource
    );

  return db.insert(planModalityActivitySchoolResources).values(values);
}

async function seedPlanModalityActivitySchoolProfessionals() {
  await db.delete(planModalityActivitySchoolProfessionals);

  const planModalityActivitySchoolList = await db.select().from(planModalityActivitySchools);
  const professionalList = await db.select().from(professionals);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          professionalId: faker.helpers.arrayElement(professionalList).id,
          planModalityActivitySchoolId: faker.helpers.arrayElement(planModalityActivitySchoolList)
            .id,
        }) satisfies NewPlanModalityActivitySchoolProfessional
    );

  return db.insert(planModalityActivitySchoolProfessionals).values(values);
}

async function seedPlanModalityActivitySchoolChildren() {
  await db.delete(planModalityActivitySchoolChildren);

  const planModalityActivitySchoolList = await db.select().from(planModalityActivitySchools);
  const childList = await db.select().from(children);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          childId: faker.helpers.arrayElement(childList).id,
          planModalityActivitySchoolId: faker.helpers.arrayElement(planModalityActivitySchoolList)
            .id,
          status: faker.helpers.arrayElement(['pending', 'confirmed', 'rejected']),
        }) satisfies NewPlanModalityActivitySchoolChild
    );

  return db.insert(planModalityActivitySchoolChildren).values(values);
}

async function seedPlanModalityActivitySchoolProofs() {
  await db.delete(planModalityActivitySchoolProofs);

  const planModalityActivitySchoolList = await db.select().from(planModalityActivitySchools);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          planModalityActivitySchoolId: faker.helpers.arrayElement(planModalityActivitySchoolList)
            .id,
          note: faker.lorem.lines(1),
        }) satisfies NewPlanModalityActivitySchoolProof
    );

  return db.insert(planModalityActivitySchoolProofs).values(values);
}

async function seedPlanModalityActivitySchoolProofFiles() {
  await db.delete(planModalityActivitySchoolProofFiles);

  const planModalityActivitySchoolProofList = await db
    .select()
    .from(planModalityActivitySchoolProofs);
  const proofFileClassificationList = await db.select().from(proofFileClassifications);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          planModalityActivitySchoolProofId: faker.helpers.arrayElement(
            planModalityActivitySchoolProofList
          ).id,
          proofFileClassificationId: faker.helpers.arrayElement(proofFileClassificationList).id,
          filePath: faker.internet.url(),
        }) satisfies NewPlanModalityActivitySchoolProofFile
    );

  return db.insert(planModalityActivitySchoolProofFiles).values(values);
}

async function seedPlanModalityActivitySchoolProofChildrenAttendances() {
  await db.delete(planModalityActivitySchoolProofChildrenAttendances);

  const planModalityActivitySchoolProofList = await db
    .select()
    .from(planModalityActivitySchoolProofs);
  const planModalityActivitySchoolChildList = await db
    .select()
    .from(planModalityActivitySchoolChildren);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          planModalityActivitySchoolProofId: faker.helpers.arrayElement(
            planModalityActivitySchoolProofList
          ).id,
          planModalityActivitySchoolChildId: faker.helpers.arrayElement(
            planModalityActivitySchoolChildList
          ).id,
          attended: faker.helpers.arrayElement([true, false]),
        }) satisfies NewPlanModalityActivitySchoolProofChildAttendance
    );

  return db.insert(planModalityActivitySchoolProofChildrenAttendances).values(values);
}

async function seedSuppliers() {
  await db.delete(suppliers);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          name: faker.company.name(),
        }) satisfies NewSupplier
    );
  return db.insert(suppliers).values(values);
}

async function seedResourceClassifications() {
  await db.delete(resourceClassifications);
  const values = Array(12)
    .fill('')
    .map(
      () =>
        ({
          name: faker.commerce.productAdjective(),
        }) satisfies NewResourceClassification
    );
  return db.insert(resourceClassifications).values(values);
}

async function seedResources() {
  await db.delete(resourcesToSuppliers);
  await db.delete(resources);

  const resourceClassificationList = await db.select().from(resourceClassifications);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          name: faker.commerce.product(),
          price: parseFloat(faker.commerce.price()),
          resourceClassificationId: faker.helpers.arrayElement(resourceClassificationList).id,
        }) satisfies NewResource
    );

  return db.insert(resources).values(values);
}

async function seedResourcesToSupplier() {
  await db.delete(resourcesToSuppliers);

  const supplierList = await db.select().from(suppliers);
  const resourceList = await db.select().from(resources);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          resourceId: faker.helpers.arrayElement(resourceList).id,
          supplierId: faker.helpers.arrayElement(supplierList).id,
        }) satisfies NewResourceToSupplier
    );

  return db.insert(resourcesToSuppliers).values(values);
}

async function seedInventories() {
  await db.delete(inventories);

  const resourceList = await db.select().from(resources);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          qty: faker.helpers.rangeToNumber({ min: 1, max: 1000 }),
          resourceId: faker.helpers.arrayElement(resourceList).id,
        }) satisfies NewInventory
    );

  return db.insert(inventories).values(values);
}

async function seedInventoryTransactions() {
  await db.delete(inventoryTransactions);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          type: faker.helpers.arrayElement(['stock', 'restock', 'consume']),
          supplierInvoiceNumber: faker.commerce.isbn(),
          note: faker.lorem.lines(1),
        }) satisfies NewInventoryTransaction
    );

  return db.insert(inventoryTransactions).values(values);
}

async function seedInventoryTransactionLines() {
  await db.delete(inventoryTransactionLines);

  const resourceList = await db.select().from(resources);
  const inventoryTransactionList = await db.select().from(inventoryTransactions);

  const values = Array(20)
    .fill('')
    .map(
      () =>
        ({
          qty: faker.helpers.arrayElement([1, 2, 3, 4, 5, 6, 7]),
          resourceId: faker.helpers.arrayElement(resourceList).id,
          inventoryTransactionId: faker.helpers.arrayElement(inventoryTransactionList).id,
        }) satisfies NewInventoryTransactionLine
    );

  return db.insert(inventoryTransactionLines).values(values);
}

async function deleteChildrenFirst() {
  await db.delete(inventoryTransactionLines);
  await db.delete(inventoryTransactions);
  await db.delete(planModalityActivitySchoolProofChildrenAttendances);
  await db.delete(planModalityActivitySchoolProofFiles);
  await db.delete(planModalityActivitySchoolProofs);
  await db.delete(planModalityActivitySchoolChildren);
  await db.delete(planModalityActivitySchoolProfessionals);
  await db.delete(planModalityActivitySchoolResources);
  await db.delete(planModalityActivitySchools);
  await db.delete(planModalityActivityResources);
  await db.delete(planModalityActivities);
  await db.delete(planModalities);
  await db.delete(plans);
  await db.delete(modalities);
  await db.delete(programs);
  await db.delete(children);
  await db.delete(guardians);
  await db.delete(professionals);
  await db.delete(proofFileClassifications);
  await db.delete(identifications);
  await db.delete(inventories);
  await db.delete(resourcesToSuppliers);
  await db.delete(resources);
  await db.delete(resourceClassifications);
  await db.delete(suppliers);
  await db.delete(schools);
  await db.delete(cities);
  return;
}

async function seed() {
  if (env.NODE_ENV !== 'development') {
    throw new Error('Seeder is a `dev` only script meant for mocking data.');
  }

  console.log('Seeding...');

  await deleteChildrenFirst();

  await seedModalityTypes();
  await seedKinships();
  await seedServicesAipi();
  await seedBeneficiaryTypes();
  await seedEducationLevels();
  await seedEthnicities();
  await seedGenders();
  await seedIdentifications();
  await seedIndigenousCommunities();
  await seedIndigenousReserves();
  await seedPopulations();
  await seedSchoolGrades();
  await seedShifts();
  await seedStates();
  await seedVulnerabilityFactors();
  await seedCountries();

  await seedCities();
  await seedSchools();
  await seedSuppliers();
  await seedResourceClassifications();
  await seedResources();
  await seedResourcesToSupplier();
  await seedInventories();
  await seedProofFileClassifications();
  await seedProfessionals();
  await seedGuardians();
  await seedChildren();
  await seedPrograms();
  await seedModalities();
  await seedPlans();
  await seedPlanModalities();
  await seedPlanModalityActivities();
  await seedPlanModalityActivityResources();
  await seedPlanModalityActivitySchools();
  await seedPlanModalityActivitySchoolResources();
  await seedPlanModalityActivitySchoolProfessionals();
  await seedPlanModalityActivitySchoolChildren();
  await seedPlanModalityActivitySchoolProofs();
  await seedPlanModalityActivitySchoolProofFiles();
  await seedPlanModalityActivitySchoolProofChildrenAttendances();
  await seedInventoryTransactions();
  await seedInventoryTransactionLines();
}

seed()
  .catch((e) => {
    console.error(e);
    conn.end();
    process.exit(1);
  })
  .finally(() => {
    console.log('Seeding done!');
    conn.end();
    process.exit(0);
  });
