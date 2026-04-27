import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  CircularProgress,
  IconButton,
  Alert,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, FormatBold, FormatItalic, FormatUnderlined, FormatListBulleted, FormatListNumbered, Link as LinkIcon, Image as ImageIcon } from '@mui/icons-material';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useKnowledgeStore } from '../../services/stores/useKnowledgeStore';
import type { Article, Category, Tag } from '../../models/knowledge.model';

interface ArticleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  article?: Article | null;
  categories: Category[];
  tags: Tag[];
}

const ArticleFormModal: React.FC<ArticleFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  article,
  categories,
  tags
}) => {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { uploadImage } = useKnowledgeStore();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'article-image',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'article-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Напишите содержание статьи...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  });

  useEffect(() => {
    if (article && editor) {
      setTitle(article.title);
      editor.commands.setContent(article.content);
      setCoverImage(article.cover_image || '');
      setSelectedCategoryIds(article.categories.map(c => c.id));
      setSelectedTagIds(article.tags.map(t => t.id));
    } else if (!article && editor) {
      setTitle('');
      editor.commands.setContent('');
      setCoverImage('');
      setSelectedCategoryIds([]);
      setSelectedTagIds([]);
    }
  }, [article, editor, isOpen]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
      return url;
    } catch (error: any) {
      setUploadError(error.message || 'Ошибка загрузки изображения');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleEditorImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    setUploadError(null);
    
    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
    } catch (error: any) {
      setUploadError(error.message || 'Ошибка загрузки изображения');
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedCategoryIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedTagIds(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = () => {
    const content = editor?.getHTML() || '';
    
    onSave({
      title,
      content,
      cover_image: coverImage,
      category_ids: selectedCategoryIds,
      tag_ids: selectedTagIds
    });
  };

  const handleClose = () => {
    setUploadError(null);
    onClose();
  };

  const MenuButton = ({ onClick, active, children, disabled }: any) => (
    <Button
      size="small"
      onClick={onClick}
      disabled={disabled}
      variant={active ? "contained" : "outlined"}
      sx={{
        minWidth: '32px',
        width: '32px',
        height: '32px',
        p: 0,
        '&.MuiButton-contained': {
          bgcolor: '#5242ba',
          '&:hover': { bgcolor: '#4135a0' }
        }
      }}
    >
      {children}
    </Button>
  );

  const AddLinkButton = () => {
    const [url, setUrl] = useState('');
    const [open, setOpen] = useState(false);

    const addLink = () => {
      if (url && editor) {
        editor.chain().focus().setLink({ href: url }).run();
        setUrl('');
        setOpen(false);
      }
    };

    if (!editor) return null;

    return (
      <>
        <MenuButton
          onClick={() => setOpen(true)}
          active={editor.isActive('link')}
        >
          <LinkIcon fontSize="small" />
        </MenuButton>
        
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm">
          <DialogTitle>Добавить ссылку</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              fullWidth
              placeholder="https://example.com"
              onKeyDown={(e) => e.key === 'Enter' && addLink()}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Отмена</Button>
            <Button onClick={addLink} variant="contained">Добавить</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          height: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {article ? 'Редактировать статью' : 'Добавить статью'}
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ overflow: 'auto' }}>
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
            {uploadError}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            placeholder="Введите заголовок статьи"
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Обложка
            </Typography>
            {coverImage && (
              <Box sx={{ position: 'relative', mb: 2, width: '200px' }}>
                <img
                  src={coverImage}
                  alt="Cover"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'white' }}
                  onClick={() => setCoverImage('')}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
            <Button
              variant="outlined"
              component="label"
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : 'Загрузить изображение'}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    await handleImageUpload(file);
                  }
                }}
              />
            </Button>
          </Box>

          <FormControl fullWidth>
            <InputLabel>Категории</InputLabel>
            <Select
              multiple
              value={selectedCategoryIds}
              onChange={handleCategoryChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const category = categories.find(c => c.id === value);
                    return <Chip key={value} label={category?.name || value} size="small" />;
                  })}
                </Box>
              )}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Теги</InputLabel>
            <Select
              multiple
              value={selectedTagIds}
              onChange={handleTagChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const tag = tags.find(t => t.id === value);
                    return <Chip key={value} label={tag?.name || value} size="small" />;
                  })}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>
                  {tag.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Содержимое
            </Typography>
            
            {/* Toolbar */}
            <Box sx={{ 
              border: '1px solid #e0e0e0', 
              borderRadius: '8px 8px 0 0', 
              p: 1, 
              bgcolor: '#f5f5f5',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center'
            }}>
              <MenuButton
                onClick={() => editor?.chain().focus().toggleBold().run()}
                active={editor?.isActive('bold')}
                disabled={!editor}
              >
                <FormatBold fontSize="small" />
              </MenuButton>
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                active={editor?.isActive('italic')}
                disabled={!editor}
              >
                <FormatItalic fontSize="small" />
              </MenuButton>
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                active={editor?.isActive('underline')}
                disabled={!editor}
              >
                <FormatUnderlined fontSize="small" />
              </MenuButton>
              
              <Box sx={{ width: 1, height: 30, borderLeft: '1px solid #ccc', mx: 0.5 }} />
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                active={editor?.isActive('bulletList')}
                disabled={!editor}
              >
                <FormatListBulleted fontSize="small" />
              </MenuButton>
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                active={editor?.isActive('orderedList')}
                disabled={!editor}
              >
                <FormatListNumbered fontSize="small" />
              </MenuButton>
              
              <Box sx={{ width: 1, height: 30, borderLeft: '1px solid #ccc', mx: 0.5 }} />
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor?.isActive('heading', { level: 2 })}
                disabled={!editor}
              >
                H2
              </MenuButton>
              
              <MenuButton
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor?.isActive('heading', { level: 3 })}
                disabled={!editor}
              >
                H3
              </MenuButton>
              
              <Box sx={{ width: 1, height: 30, borderLeft: '1px solid #ccc', mx: 0.5 }} />
              
              <AddLinkButton />
              
              <Button
                size="small"
                component="label"
                variant="outlined"
                disabled={!editor || uploading}
                sx={{ minWidth: '32px', width: '32px', height: '32px', p: 0 }}
              >
                <ImageIcon fontSize="small" />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleEditorImageUpload}
                />
              </Button>
            </Box>
            
            {/* Editor */}
            <Box sx={{
              border: '1px solid #e0e0e0',
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              minHeight: '400px',
              '& .tiptap-editor': {
                minHeight: '400px',
                padding: '16px',
                outline: 'none',
                '& p': { margin: '0 0 1em 0' },
                '& h1, & h2, & h3, & h4': { margin: '0.5em 0' },
                '& ul, & ol': { paddingLeft: '1.5em' },
                '& img': { maxWidth: '100%', height: 'auto', margin: '1em 0', borderRadius: '8px' },
                '& a': { color: '#5242ba', textDecoration: 'none' },
                '& a:hover': { textDecoration: 'underline' },
                '& .ProseMirror-selectednode': { outline: '2px solid #5242ba' },
                '& p.is-editor-empty:first-child::before': {
                  content: 'attr(data-placeholder)',
                  float: 'left',
                  color: '#adb5bd',
                  pointerEvents: 'none',
                  height: 0,
                }
              }
            }}>
              <EditorContent editor={editor} />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title.trim()}
          sx={{ bgcolor: '#5242ba', '&:hover': { bgcolor: '#4135a0' } }}
        >
          {article ? 'Сохранить' : 'Создать'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArticleFormModal;