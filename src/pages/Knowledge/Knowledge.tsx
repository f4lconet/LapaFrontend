import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Typography,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useKnowledgeStore } from '../../services/stores/useKnowledgeStore';
import { useAuthStore } from '../../services/stores/useAuthStore';
import ArticleCard from '../../components/knowledge/ArticleCard';
import ArticleFormModal from '../../components/knowledge/ArticleFormModal';
import FilterModal from '../../components/knowledge/FilterModal';
import AddCategoryModal from '../../components/knowledge/AddCategoryModal';
import type { Article } from '../../models/knowledge.model';
import './Knowledge.scss';
import KnowledgeBgImage from '../../assets/images/knowledge-bg-desktop.png'
import { BurgerMenu } from '../../components/navigation/BurgerMenu';

const Knowledge: React.FC = () => {
  const {
    articles,
    featuredArticle,
    loading,
    error,
    filters,
    categories,
    tags,
    isFilterModalOpen,
    setFilters,
    fetchArticles,
    fetchCategories,
    fetchTags,
    createArticle,
    updateArticle,
    deleteArticle,
    createCategory,
    toggleFilterModal,
    clearError
  } = useKnowledgeStore();

  const { user } = useAuthStore();
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchArticles();
    fetchCategories();
    fetchTags();
  }, []);

  useEffect(() => {
    if (error) {
      setSnackbarOpen(true);
    }
  }, [error]);

  const handleSearch = () => {
    setFilters({ search: searchInput });
  };

  const handleAddArticle = () => {
    if (!isAdmin) return;
    setEditingArticle(null);
    setIsArticleModalOpen(true);
  };

  const handleEditArticle = (article: Article) => {
    if (!isAdmin) return;
    setEditingArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleDeleteArticle = async (article: Article) => {
    if (!isAdmin) return;
    if (window.confirm(`Вы уверены, что хотите удалить статью "${article.title}"?`)) {
      await deleteArticle(article.id);
    }
  };

  const handleSaveArticle = async (data: any) => {
    if (!isAdmin) return;
    if (editingArticle) {
      await updateArticle(editingArticle.id, data);
    } else {
      await createArticle(data);
    }
    setIsArticleModalOpen(false);
    setEditingArticle(null);
  };

  const handleAddCategory = async (categoryName: string) => {
    if (!isAdmin) return;
    await createCategory(categoryName);
    setIsCategoryModalOpen(false);
  };

  const otherArticles = featuredArticle ? articles.slice(1) : articles;

  return (
    <Container maxWidth={false} className="knowledge-page" sx={{ maxWidth: '1420px !important', py: 3 }}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => {
          setSnackbarOpen(false);
          clearError();
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => {
          setSnackbarOpen(false);
          clearError();
        }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Paper
        className="knowledge-header"
        sx={{
          width: '100%',
          height: '420px',
          backgroundImage: `url(${KnowledgeBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '30px',
          mb: 4,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '30px',
          }
        }}
      >
        <Box sx={{position: 'absolute', top: 10, right: 10, zIndex: 3}}>
          <BurgerMenu/>
        </Box>
        <Box className="header-content" sx={{ marginLeft: '20%', marginBottom: '10%', textAlign: 'center', zIndex: 1, color: 'rgba(32, 41, 80, 1)'}}>
          <Typography variant="h1" sx={{ fontSize: '64px', mb: 2, color: 'rgba(32, 41, 80, 1)', fontWeight: 700 }}>
            База знаний
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '13px', maxWidth: '280px', mx: 'auto', fontWeight: 300 }}>
            Полезные материалы, истории и советы о помощи животным и их благополучии
          </Typography>
        </Box>
      </Paper>

      {/* Controls */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            onClick={toggleFilterModal}
            sx={{ width: 38, height: 38, border: '1px solid #ddd', borderRadius: '8px' }}
          >
            <FilterIcon />
          </IconButton>
          <TextField
            placeholder="Поиск статей..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            sx={{
              flex: 1,
              maxWidth: '1038px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              }
            }}
            slotProps={{
              input: {
                endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              }
            }}
          />
        </Box>
        
        {isAdmin && (
          <Box sx={{marginLeft: '60%', display: 'flex', gap: '10px'}}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsCategoryModalOpen(true)}
              sx={{
                bgcolor: '#5242ba',
                borderRadius: '20px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#4135a0' }
              }}
            >
              Добавить категорию
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddArticle}
              sx={{
                bgcolor: '#5242ba',
                borderRadius: '20px',
                textTransform: 'none',
                '&:hover': { bgcolor: '#4135a0' }
              }}
            >
              Добавить статью
            </Button>
          </Box>
          
        )}
      </Box>

      {loading && articles.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {featuredArticle && (
            <Box sx={{ mb: 6 }}>
              <ArticleCard
                article={featuredArticle}
                variant="horizontal"
                isAdmin={isAdmin}
                onEdit={handleEditArticle}
                onDelete={handleDeleteArticle}
              />
            </Box>
          )}

          <Grid container spacing={4}>
            {otherArticles.map((article) => (
              <Grid sx={{xs: 12, sm: 6, md: 4}} key={article.id}>
                <ArticleCard
                  article={article}
                  variant="vertical"
                  isAdmin={isAdmin}
                  onEdit={handleEditArticle}
                  onDelete={handleDeleteArticle}
                />
              </Grid>
            ))}
          </Grid>

          {articles.length === 0 &&  !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="body1" color="textSecondary">
                Статьи не найдены
              </Typography>
            </Box>
          )}
        </>
      )}

      <ArticleFormModal
        isOpen={isArticleModalOpen}
        onClose={() => {
          setIsArticleModalOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveArticle}
        article={editingArticle}
        categories={categories}
        tags={tags}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={toggleFilterModal}
        filters={filters}
        onApplyFilters={setFilters}
        categories={categories}
        tags={tags}
      />

      <AddCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onAdd={handleAddCategory}
      />
    </Container>
  );
};

export default Knowledge;