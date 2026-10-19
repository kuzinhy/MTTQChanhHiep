import { z } from 'zod';

export const UserPermissionsSchema = z.object({
  post_create: z.boolean(),
  post_edit: z.boolean(),
  post_delete: z.boolean(),
  post_publish: z.boolean(),
  document_create: z.boolean(),
  document_edit: z.boolean(),
  document_delete: z.boolean(),
  user_view: z.boolean(),
  user_manage: z.boolean(),
  settings_manage: z.boolean(),
  cultural_manage: z.boolean().optional(),
  media_upload: z.boolean().optional(),
  audit_view: z.boolean().optional(),
  survey_manage: z.boolean().optional(),
  competition_manage: z.boolean().optional(),
  opinion_manage: z.boolean().optional(),
});

export const UserRoleSchema = z.enum([
  'PUBLIC', 'CONTRIBUTOR', 'STAFF', 'NEIGHBORHOOD_LEADER', 'EDITOR', 
  'REVIEWER', 'PUBLISHER', 'CONTEST_MANAGER', 'FEEDBACK_OFFICER', 
  'ORGANIZATION_ADMIN', 'MANAGER', 'ADMIN', 'SUPER_ADMIN', 
  'MTTQ_ADMIN', 'LEADER', 'SPECIALIST', 'YOUTH_UNION', 'CLERK'
] as [string, ...string[]]);

export const StaffUserSchema = z.object({
  id: z.string(),
  uid: z.string().optional(),
  email: z.string().email(),
  fullname: z.string().min(1),
  role: UserRoleSchema,
  position: z.string(),
  department: z.string(),
  permissions: z.array(z.string()),
  permissionMap: UserPermissionsSchema.optional(),
  organizationId: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
});

export type StaffUser = z.infer<typeof StaffUserSchema>;

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string(),
  content: z.string(),
  category: z.string(),
  status: z.enum(['Draft', 'Pending Review', 'Approved', 'Published', 'Archived']),
  authorId: z.string().optional(),
  authorName: z.string(),
  publishDate: z.string(),
  views: z.number().default(0),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Article = z.infer<typeof ArticleSchema>;

export const OfficialDocumentSchema = z.object({
  id: z.string(),
  codeNumber: z.string().min(1),
  title: z.string().min(1),
  docType: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  field: z.string(),
  signer: z.string(),
  isPublic: z.boolean(),
  status: z.string(),
  createdAt: z.string().optional(),
});

export type OfficialDocument = z.infer<typeof OfficialDocumentSchema>;

export const PublicOpinionSchema = z.object({
  id: z.string(),
  receiptCode: z.string().min(1),
  topic: z.string(),
  content: z.string().min(1),
  neighborhood: z.string(),
  isAnonymous: z.boolean(),
  status: z.string(),
  priority: z.string(),
  createdAt: z.string(),
});

export type PublicOpinion = z.infer<typeof PublicOpinionSchema>;

export const CompetitionSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.string(),
  createdAt: z.string(),
});
export type Competition = z.infer<typeof CompetitionSchema>;

export const CompetitionSubmissionSchema = z.object({
  id: z.string(),
  competitionId: z.string(),
  participantId: z.string(),
  content: z.string(),
  createdAt: z.string(),
});
export type CompetitionSubmission = z.infer<typeof CompetitionSubmissionSchema>;

export const DriveFileItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  size: z.number(),
  createdAt: z.string(),
});
export type DriveFileItem = z.infer<typeof DriveFileItemSchema>;

