import React, { useState } from 'react';
import { Note } from '../../types';
import { StickyNote, Plus, Search, Pin, Trash2, Tag, Edit, Sparkles, Check } from 'lucide-react';

interface PersonalNotesViewProps {
  notes: Note[];
  onAddNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const PersonalNotesView: React.FC<PersonalNotesViewProps> = ({
  notes,
  onAddNote,
  onDeleteNote,
  onTogglePin
}) => {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('bg-amber-100 border-amber-300');
  const [tagsInput, setTagsInput] = useState('Hành chính, Nhắc việc');

  const colorOptions = [
    { label: 'Vàng Mặt trận', value: 'bg-amber-100 border-amber-300' },
    { label: 'Đỏ Đô', value: 'bg-red-100 border-red-300' },
    { label: 'Xanh Lá Công tác', value: 'bg-emerald-100 border-emerald-300' },
    { label: 'Xanh Lam Hành chính', value: 'bg-sky-100 border-sky-300' },
    { label: 'Ghi Đá Tuyên truyền', value: 'bg-stone-200 border-stone-400' }
  ];

  const filteredNotes = notes.filter(n => {
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.content.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (selectedTag !== 'ALL' && (!n.tags || !n.tags.includes(selectedTag))) {
      return false;
    }
    return true;
  });

  const pinnedNotes = filteredNotes.filter(n => n.isPinned);
  const otherNotes = filteredNotes.filter(n => !n.isPinned);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newNote: Note = {
      id: 'note-' + Date.now(),
      userId: 'staff-1',
      title,
      content,
      color,
      isPinned: false,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    onAddNote(newNote);
    setIsModalOpen(false);
    setTitle('');
    setContent('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-xs border border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
            <StickyNote className="w-4 h-4 text-amber-600" />
            <span>GHI CHÚ NỘI BỘ &amp; SỔ TAY CÁN BỘ</span>
          </div>
          <h1 className="text-xl font-black text-stone-900 mt-1">Sổ Tay Công Tác &amp; Ý Tưởng</h1>
          <p className="text-xs text-stone-500 mt-0.5">Lưu trữ nhắc việc, ý tưởng dự thảo kế hoạch và nội dung làm việc khu phố</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Tạo Ghi chú mới</span>
        </button>
      </div>

      {/* Search & Tag Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm kiếm nội dung ghi chú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-red-800 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs overflow-x-auto w-full md:w-auto">
          <Tag className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="font-semibold text-stone-600 shrink-0">Nhãn:</span>
          {['ALL', 'Hành chính', 'Khu phố', 'An sinh', 'Chuẩn bị họp'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedTag === tag
                  ? 'bg-red-800 text-amber-200'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {tag === 'ALL' ? 'Tất cả' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Notes Section */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 fill-amber-700 text-amber-700" />
            <span>GHI CHÚ ĐÃ GHIM TRÊN CÙNG ({pinnedNotes.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={onDeleteNote} onTogglePin={onTogglePin} />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes Section */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wide">
          GHI CHÚ KHÁC ({otherNotes.length})
        </h2>
        {otherNotes.length === 0 && pinnedNotes.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200 text-stone-500">
            <StickyNote className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <p className="font-bold text-sm text-stone-700">Chưa có ghi chú nào</p>
            <p className="text-xs text-stone-400 mt-1">Bấm "Tạo Ghi chú mới" để bắt đầu lưu lại ý tưởng công tác Mặt trận.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherNotes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={onDeleteNote} onTogglePin={onTogglePin} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between border-b pb-3 border-stone-200">
              <h3 className="font-bold text-base text-stone-900">Tạo Ghi chú Mới</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 font-bold hover:text-stone-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tiêu đề Ghi chú *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Nội dung lưu ý chuẩn bị Ngày hội Đại đoàn kết..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nội dung chi tiết</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung ghi chú, nhiệm vụ cần nhớ..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Màu sắc thẻ</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {colorOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setColor(opt.value)}
                      className={`p-2 text-[11px] font-bold rounded-lg border text-left flex items-center justify-between ${opt.value} ${
                        color === opt.value ? 'ring-2 ring-red-800' : ''
                      }`}
                    >
                      <span>{opt.label}</span>
                      {color === opt.value && <Check className="w-3.5 h-3.5 text-stone-900" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Nhãn (phân cách bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ví dụ: Hành chính, Khu phố, Giao ban"
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-red-800 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-700 font-bold rounded-xl hover:bg-stone-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-800 text-amber-200 font-bold rounded-xl hover:bg-red-900 shadow-xs"
                >
                  Lưu Ghi chú
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const NoteCard: React.FC<{
  note: Note;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}> = ({ note, onDelete, onTogglePin }) => {
  return (
    <div className={`p-4 rounded-2xl border shadow-2xs transition-all relative flex flex-col justify-between ${note.color}`}>
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm text-stone-900">{note.title}</h3>
          <button
            onClick={() => onTogglePin(note.id)}
            className={`p-1 rounded-lg transition-colors ${
              note.isPinned ? 'text-amber-800 bg-amber-200/80' : 'text-stone-400 hover:text-stone-700'
            }`}
            title={note.isPinned ? 'Bỏ ghim' : 'Ghim ghi chú'}
          >
            <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-800' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-stone-700 mt-2 whitespace-pre-line leading-relaxed">
          {note.content}
        </p>
      </div>

      <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between text-[11px] text-stone-600">
        <div className="flex flex-wrap gap-1">
          {note.tags?.map((t, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-black/5 text-stone-800 rounded font-semibold text-[10px]">
              #{t}
            </span>
          ))}
        </div>

        <button
          onClick={() => onDelete(note.id)}
          className="text-stone-500 hover:text-red-700 transition-colors p-1"
          title="Xóa ghi chú"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
