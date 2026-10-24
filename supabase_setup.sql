-- Cập nhật file script SQL để có thể chạy lại nhiều lần an toàn (idempotent)
-- Xóa các policy cũ nếu đã tồn tại trước khi tạo mới

DROP POLICY IF EXISTS "Public articles read" ON articles;
DROP POLICY IF EXISTS "Public articles insert/update" ON articles;
DROP POLICY IF EXISTS "Public documents read" ON documents;
DROP POLICY IF EXISTS "Public documents write" ON documents;
DROP POLICY IF EXISTS "Public opinions read" ON public_opinions;
DROP POLICY IF EXISTS "Public opinions write" ON public_opinions;
DROP POLICY IF EXISTS "Public tasks read" ON tasks;
DROP POLICY IF EXISTS "Public tasks write" ON tasks;
DROP POLICY IF EXISTS "Public staff read" ON staff_users;
DROP POLICY IF EXISTS "Public staff write" ON staff_users;

-- 1. Bảng Bài viết (Articles)
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    content TEXT,
    category TEXT,
    status TEXT DEFAULT 'Draft',
    author_id TEXT,
    author_name TEXT,
    publish_date TEXT,
    featured_image JSONB,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng Văn bản pháp quy / Thông báo (Official Documents)
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    code_number TEXT NOT NULL,
    title TEXT NOT NULL,
    doc_type TEXT,
    issuer TEXT,
    issue_date TEXT,
    field TEXT,
    signer TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'Active',
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng Ý kiến dân sinh / Phản ánh (Public Opinions)
CREATE TABLE IF NOT EXISTS public_opinions (
    id TEXT PRIMARY KEY,
    receipt_code TEXT NOT NULL,
    topic TEXT,
    content TEXT NOT NULL,
    neighborhood TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    fullname TEXT,
    phone TEXT,
    email TEXT,
    status TEXT DEFAULT 'Received',
    priority TEXT DEFAULT 'Normal',
    response_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng Công việc (Tasks)
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'Pending',
    due_date TEXT,
    priority TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng Tài khoản cán bộ (Staff Users)
CREATE TABLE IF NOT EXISTS staff_users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    fullname TEXT NOT NULL,
    role TEXT NOT NULL,
    position TEXT,
    department TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bật Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_opinions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;

-- Tạo lại chính sách truy cập an toàn
CREATE POLICY "Public articles read" ON articles FOR SELECT USING (true);
CREATE POLICY "Public articles insert/update" ON articles FOR ALL USING (true);

CREATE POLICY "Public documents read" ON documents FOR SELECT USING (true);
CREATE POLICY "Public documents write" ON documents FOR ALL USING (true);

CREATE POLICY "Public opinions read" ON public_opinions FOR SELECT USING (true);
CREATE POLICY "Public opinions write" ON public_opinions FOR ALL USING (true);

CREATE POLICY "Public tasks read" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public tasks write" ON tasks FOR ALL USING (true);

CREATE POLICY "Public staff read" ON staff_users FOR SELECT USING (true);
CREATE POLICY "Public staff write" ON staff_users FOR ALL USING (true);
