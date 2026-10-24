import { supabase } from './supabaseClient';
import { Article, OfficialDocument, PublicOpinion, Task, StaffUser } from '../types';

export const SupabaseService = {
  // --- ARTICLES ---
  async getArticles(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('publish_date', { ascending: false });
    if (error) {
      console.error('Error fetching articles from Supabase:', error);
      return [];
    }
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      category: item.category,
      status: item.status,
      authorId: item.author_id,
      authorName: item.author_name,
      publishDate: item.publish_date,
      featuredImage: item.featured_image,
      views: item.views || 0,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }));
  },

  async saveArticle(article: Article): Promise<boolean> {
    const payload = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      category: article.category,
      status: article.status,
      author_id: article.authorId,
      author_name: article.authorName,
      publish_date: article.publishDate,
      featured_image: article.featuredImage,
      views: article.views,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase.from('articles').upsert(payload);
    if (error) {
      console.error('Error saving article to Supabase:', error);
      return false;
    }
    return true;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) {
      console.error('Error deleting article from Supabase:', error);
      return false;
    }
    return true;
  },

  // --- DOCUMENTS ---
  async getDocuments(): Promise<OfficialDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching documents from Supabase:', error);
      return [];
    }
    return (data || []).map((item: any) => ({
      id: item.id,
      codeNumber: item.code_number,
      title: item.title,
      docType: item.doc_type,
      issuer: item.issuer,
      issueDate: item.issue_date,
      field: item.field,
      signer: item.signer,
      isPublic: item.is_public,
      status: item.status,
      createdAt: item.created_at
    }));
  },

  async saveDocument(docItem: OfficialDocument): Promise<boolean> {
    const payload = {
      id: docItem.id,
      code_number: docItem.codeNumber,
      title: docItem.title,
      doc_type: docItem.docType,
      issuer: docItem.issuer,
      issue_date: docItem.issueDate,
      field: docItem.field,
      signer: docItem.signer,
      is_public: docItem.isPublic,
      status: docItem.status
    };
    const { error } = await supabase.from('documents').upsert(payload);
    if (error) {
      console.error('Error saving document to Supabase:', error);
      return false;
    }
    return true;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      console.error('Error deleting document from Supabase:', error);
      return false;
    }
    return true;
  },

  // --- PUBLIC OPINIONS ---
  async getOpinions(): Promise<PublicOpinion[]> {
    const { data, error } = await supabase
      .from('public_opinions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching opinions from Supabase:', error);
      return [];
    }
    return (data || []).map((item: any) => ({
      id: item.id,
      receiptCode: item.receipt_code,
      topic: item.topic,
      content: item.content,
      neighborhood: item.neighborhood,
      isAnonymous: item.is_anonymous,
      fullname: item.fullname,
      phone: item.phone,
      email: item.email,
      status: item.status,
      priority: item.priority,
      createdAt: item.created_at
    }));
  },

  async saveOpinion(opinion: PublicOpinion): Promise<boolean> {
    const payload = {
      id: opinion.id,
      receipt_code: opinion.receiptCode,
      topic: opinion.topic,
      content: opinion.content,
      neighborhood: opinion.neighborhood,
      is_anonymous: opinion.isAnonymous,
      fullname: opinion.fullname,
      phone: opinion.phone,
      email: opinion.email,
      status: opinion.status,
      priority: opinion.priority
    };
    const { error } = await supabase.from('public_opinions').upsert(payload);
    if (error) {
      console.error('Error saving opinion to Supabase:', error);
      return false;
    }
    return true;
  },

  // --- TASKS ---
  async getTasks(): Promise<Task[]> {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return [];
    return (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      assignedTo: item.assigned_to,
      status: item.status,
      dueDate: item.due_date,
      priority: item.priority,
      createdAt: item.created_at
    }));
  },

  async saveTask(task: Task): Promise<boolean> {
    const payload = {
      id: task.id,
      title: task.title,
      description: task.description,
      assigned_to: task.assignedTo,
      status: task.status,
      due_date: task.dueDate,
      priority: task.priority
    };
    const { error } = await supabase.from('tasks').upsert(payload);
    return !error;
  },

  // --- STAFF USERS ---
  async getStaffUsers(): Promise<StaffUser[]> {
    const { data, error } = await supabase.from('staff_users').select('*');
    if (error) return [];
    return (data || []).map((item: any) => ({
      id: item.id,
      email: item.email,
      fullname: item.fullname,
      role: item.role,
      position: item.position,
      department: item.department,
      active: item.active,
      createdAt: item.created_at
    }));
  },

  async saveStaffUser(user: StaffUser): Promise<boolean> {
    const payload = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      position: user.position,
      department: user.department,
      active: user.active
    };
    const { error } = await supabase.from('staff_users').upsert(payload);
    return !error;
  }
};
