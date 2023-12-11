// export interface ApplicationType {
//   id: number;
//   name: string;
//   thumbnail: string;
//   outcome: string[];
//   requirementInfo: string;
//   createdAt: string;
//   updatedAt: string;
//   forms: FormType[];
//   services: Service[];
// }

// export interface FormType {
//   id: number;
//   name: string;
//   createdAt: string;
//   updatedAt: string;
//   fields: Field[];
//   application: ApplicationType;
// }

// export interface Field {
//   id: number;
//   name: string;
//   type: string;
//   options: string[];
//   form: FormType;
//   isRequired?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface Service {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
//   files: File[];
//   application: ApplicationType;
// }

// export interface File {
//   id: number;
//   name: string;
//   isRequired: boolean;
//   createdAt: string;
//   updatedAt: string;
//   service: Service;
// }

// DUMMY

export interface ApplicationType {
  id: number;
  name: string;
  thumbnail: string;
  outcomes: string[];
  requirementInfo: string;
  createdAt: string;
  updatedAt: string;
  forms: FormType[];
  services: ServiceType[];
}

export interface FormType {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  fields: FieldType[];
  application: Application;
}

export interface FieldType {
  id?: number;
  name: string;
  type: string;
  options: string[];
  isRequired: boolean;
  form?: Form2;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Form2 {
  name: string;
}

export interface Application {
  name: string;
}

export interface ServiceType {
  id: number;
  name: string;
  stepsInfo: string;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
  files: FileType[];
  application: Application2;
}

export interface FileType {
  id?: number;
  name: string;
  isRequired: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  service?: Service2;
}

export interface Service2 {
  name: string;
}

export interface Application2 {
  name: string;
}

export interface SubmissionType {
  code: string;
  applicationId: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  application: ApplicationType;
  submissionForms: any;
  user: UserType;
}

export interface UserType {
  id: number;
  name: string;
  email: string;
  nik: string;
  phone: string;
  placeOfBirth: string;
  dateOfBirth: string;
  password: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

export interface SubmissionResponseType {
  id: number;
  submissionFormId: number;
  formFieldId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  submissionForm: any;
  formField: FormFieldType;
}

export interface FormFieldType {
  id: number;
  name: string;
  type: string;
  options: string[];
  isRequired: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  applicationFormId: number;
  form: any;
}

export interface SubmissionFormType {
  id: number;
  submissionCode: string;
  formId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  submission: any;
  form: FormType;
  responses: SubmissionResponseType[];
}

export interface SubmissionServiceType {
  id: number;
  submissionCode: string;
  serviceId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  submission: any;
  service: ServiceType;
  responses: SubmissionFileResponseType[];
}

export interface SubmissionFileResponseType {
  id: number;
  submissionServiceId: number;
  serviceFileId: number;
  value: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  submissionService: any;
  serviceFile: FileType;
}
