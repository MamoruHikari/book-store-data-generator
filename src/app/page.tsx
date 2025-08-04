"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import TableViewIcon from '@mui/icons-material/TableView';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import DownloadIcon from '@mui/icons-material/Download';
import Papa from 'papaparse';
import { LABELS } from '@/lib/labels';
import { styled } from '@mui/material/styles';
import { Book } from '@/lib/types/book';
import { randomSeed } from '@/lib/utils';
import Image from 'next/image';

const cellClampSx = {
  maxWidth: 180,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  lineHeight: 1.5,
  paddingTop: '9px',
  paddingBottom: '9px',
  verticalAlign: 'middle',
};
const GalleryGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
}));
const BookCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  height: 320,
  boxSizing: 'border-box',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'box-shadow .2s, border-color .2s',
  border: `1.5px solid ${theme.palette.grey[200]}`,
  '&:hover, &:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  },
}));

const LOCALES = [
  { code: 'en', label: 'English (US)' },
  { code: 'tr', label: 'Turkish (TR)' },
  { code: 'ru', label: 'Russian (RU)' },
  { code: 'zh', label: 'Chinese (CN)' },
];

const INITIAL_SEED = randomSeed();
const LIMIT_FIRST = 20;
const LIMIT_NEXT = 10;

export default function Home() {
  const [locale, setLocale] = useState('en');
  const [seed, setSeed] = useState(INITIAL_SEED);
  const [likesAvg, setLikesAvg] = useState(4.7);
  const [reviewsAvg, setReviewsAvg] = useState("4.7");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState<'table' | 'gallery'>('table');
  const [expanded, setExpanded] = useState<number | false>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchBatch = useCallback(
    async (offset: number, limit: number, append = false) => {
      setLoading(true);
      const params = new URLSearchParams({
        seed,
        locale,
        likesAvg: likesAvg.toString(),
        reviewsAvg: reviewsAvg === "" ? "0" : reviewsAvg,
        offset: offset.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/books?${params}`);
      const data = await res.json();
      if (append) {
        setBooks((prev) => {
          const merged = [...prev, ...data.books];
          return merged.filter(
            (book, idx, arr) => arr.findIndex(b => b.uniqueId === book.uniqueId) === idx
          );
        });
      } else {
        setBooks(data.books);
      }
      setHasMore(data.books.length === limit);
      setLoading(false);
    },
    [seed, locale, likesAvg, reviewsAvg]
  );

  useEffect(() => {
    fetchBatch(0, LIMIT_FIRST, false);
    setExpanded(false);
  }, [seed, locale, likesAvg, reviewsAvg, fetchBatch]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el || loading || !hasMore) return;
      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < 80) {
        setLoading(true);
        fetchBatch(books.length, LIMIT_NEXT, true);
      }
    };
    const el = containerRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [books, loading, hasMore, fetchBatch]);

  const handleRandomSeed = () => setSeed(randomSeed());

  const handleExportCSV = () => {
    const csv = Papa.unparse(
      books.map((b) => ({
        Index: b.index,
        ISBN: b.isbn,
        [LABELS[locale].title]: b.title,
        [LABELS[locale].author]: b.authors.join('; '),
        [LABELS[locale].publisher]: b.publisher,
        [LABELS[locale].likes]: b.likes,
        [LABELS[locale].reviewsCount]: b.reviews.length,
        [LABELS[locale].reviews]: b.reviews.map((r) => `${r.author}: ${r.text}`).join(' | '),
      }))
    );
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `books-seed${seed}-lang${locale}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const BookCoverImg = ({ title, author }: { title: string; author: string }) => (
    <Image
      src={`/api/book-cover?title=${encodeURIComponent(title)}&author=${encodeURIComponent(author)}`}
      width={96}
      height={128}
      alt={`Cover for ${title} by ${author}`}
      style={{ display: 'block', borderRadius: 8, background: '#eee' }}
      loading="lazy"
      unoptimized
    />
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>{LABELS[locale].language}</InputLabel>
              <Select
                value={locale}
                label={LABELS[locale].language}
                onChange={(e) => setLocale(e.target.value)}
              >
                {LOCALES.map((l) => (
                  <MenuItem key={l.code} value={l.code}>
                    {l.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={3}>
            <TextField
              label={LABELS[locale].seed}
              value={seed}
              onChange={(e) => setSeed(e.target.value.replace(/\D/g, ''))}
              type="text"
              fullWidth
              inputProps={{ maxLength: 12 }}
            />
          </Grid>
          <Grid item xs={4} sm={1}>
            <IconButton aria-label={LABELS[locale].seed} onClick={handleRandomSeed}>
              <AutorenewIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Typography gutterBottom>{LABELS[locale].likes}</Typography>
            <Slider
              value={likesAvg}
              min={0}
              max={10}
              step={0.1}
              onChange={(_, v) => setLikesAvg(Number(v))}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label={LABELS[locale].reviews}
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 10 }}
              value={reviewsAvg}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === "") {
                  setReviewsAvg(value);
                }
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton
              onClick={() => setView('table')}
              color={view === 'table' ? 'primary' : 'default'}
              aria-label="Table View"
            >
              <TableViewIcon />
            </IconButton>
            <IconButton
              onClick={() => setView('gallery')}
              color={view === 'gallery' ? 'primary' : 'default'}
              aria-label="Gallery View"
            >
              <ViewModuleIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleExportCSV}
              startIcon={<DownloadIcon />}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              {LABELS[locale].csv}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Box
        ref={containerRef}
        sx={{
          height: '60vh',
          overflowY: 'auto',
          border: '1px solid #eee',
          borderRadius: 2,
          bgcolor: '#fafbfb',
        }}
      >
        {view === 'table' ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...cellClampSx, maxWidth: 41 }}>#</TableCell>
                  <TableCell sx={cellClampSx}>ISBN</TableCell>
                  <TableCell sx={cellClampSx}>{LABELS[locale].title}</TableCell>
                  <TableCell sx={cellClampSx}>{LABELS[locale].author}</TableCell>
                  <TableCell sx={cellClampSx}>{LABELS[locale].publisher}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {books.map((book) => (
                  <React.Fragment key={book.uniqueId}>
                    <TableRow
                      hover
                      sx={{
                        bgcolor:
                          expanded === book.index
                            ? 'action.selected'
                            : undefined,
                        cursor: 'pointer',
                        height: 48,
                      }}
                      onClick={() =>
                        setExpanded(expanded === book.index ? false : book.index)
                      }
                    >
                      <TableCell sx={{ ...cellClampSx, maxWidth: 41 }}>{book.index}</TableCell>
                      <TableCell sx={cellClampSx}>{book.isbn}</TableCell>
                      <TableCell sx={cellClampSx}>
                        <span title={book.title}>{book.title}</span>
                      </TableCell>
                      <TableCell sx={cellClampSx}>
                        <span title={book.authors.join(', ')}>{book.authors.join(', ')}</span>
                      </TableCell>
                      <TableCell sx={cellClampSx}>
                        <span title={book.publisher}>{book.publisher}</span>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        style={{
                          paddingBottom: 0,
                          paddingTop: 0,
                        }}
                        colSpan={5}
                      >
                        <Accordion
                          expanded={expanded === book.index}
                          onChange={(_, isExp) =>
                            setExpanded(isExp ? book.index : false)
                          }
                          elevation={0}
                          sx={{
                            bgcolor: 'transparent',
                            boxShadow: 'none',
                          }}
                        >
                          <AccordionSummary sx={{ display: 'none' }}>
                            <ExpandMoreIcon />
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <Box>
                                <BookCoverImg title={book.title} author={book.authors[0]} />
                                <Box
                                  sx={{
                                    mt: 1,
                                    px: 1,
                                    borderRadius: 1,
                                    bgcolor: '#e3efff',
                                    fontSize: 13,
                                    display: 'inline-block',
                                  }}
                                >
                                  {book.likes} ❤️
                                </Box>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                  {book.title}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  {LABELS[locale].byAuthor}{' '}
                                  <span style={{ fontStyle: 'italic' }}>
                                    {book.authors.join(', ')}
                                  </span>
                                  <br />
                                  {book.publisher}
                                </Typography>
                                {book.reviews.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                                      {LABELS[locale].reviewsCount}
                                    </Typography>
                                    {book.reviews.map((r, i) => (
                                      <Box
                                        key={i}
                                        sx={{
                                          pl: 1,
                                          mb: 0.5,
                                          borderLeft: '2px solid #eee',
                                        }}
                                      >
                                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                          {r.text}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          — {r.author}
                                        </Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {loading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {LABELS[locale].loading}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <GalleryGrid>
            {books.map((book) => (
              <BookCard
                key={book.uniqueId}
                tabIndex={0}
                elevation={expanded === book.index ? 4 : 1}
                onClick={() =>
                  setExpanded(expanded === book.index ? false : book.index)
                }
                sx={{
                  border:
                    expanded === book.index
                      ? '2px solid #1976d2'
                      : undefined,
                }}
              >
                <BookCoverImg title={book.title} author={book.authors[0]} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mt: 1,
                    width: '100%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={book.title}
                >
                  {book.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={book.authors.join(', ')}
                >
                  {book.authors.join(', ')}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    width: '100%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={book.publisher}
                >
                  {book.publisher}
                </Typography>
                <Box
                  sx={{
                    mt: 1,
                    px: 1,
                    borderRadius: 1,
                    bgcolor: '#e3efff',
                    fontSize: 13,
                    display: 'inline-block',
                  }}
                >
                  {book.likes} ❤️
                </Box>
                {expanded === book.index && (
                  <Box sx={{ mt: 1, width: '100%' }}>
                    {book.reviews.length > 0 && (
                      <>
                        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                          {LABELS[locale].reviewsCount}
                        </Typography>
                        {book.reviews.map((r, i) => (
                          <Box
                            key={i}
                            sx={{
                              pl: 1,
                              mb: 0.5,
                              borderLeft: '2px solid #eee',
                            }}
                          >
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              {r.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              — {r.author}
                            </Typography>
                          </Box>
                        ))}
                      </>
                    )}
                  </Box>
                )}
              </BookCard>
            ))}
            {loading && (
              <Box gridColumn="1/-1" textAlign="center">
                <Typography>{LABELS[locale].loading}</Typography>
              </Box>
            )}
          </GalleryGrid>
        )}
      </Box>
    </Container>
  );
}
