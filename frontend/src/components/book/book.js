import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { NotificationManager } from "react-notifications";
import { BackendApi } from "../../client/backend-api"; // Asegúrate de importar BookApi
import { BookApi } from "../../client/backend-api/book";
import { useUser } from "../../context/user-context";
import { TabPanel } from "../tabs/tab";
import { makeChartOptions } from "./chart-options";
import classes from "./styles.module.css";

export const Book = () => {
  const { bookIsbn } = useParams();
  const { user, isAdmin } = useUser();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [chartOptions, setChartOptions] = useState(null);
  const [openTab, setOpenTab] = useState(0);

  const borrowBook = () => {
    if (book && user) {
      BookApi.rentBook(book.isbn, user._id, user.email) // Llama al nuevo método rentBook
        .then(({ book, error }) => {
          if (error) {
            NotificationManager.error(error);
          } else {
            setBook(book);
          }
        })
        .catch(console.error);
    }
  };

  const returnBook = () => {
    if (book && user) {
      BackendApi.user
        .returnBook(book.isbn, user._id)
        .then(({ book, error }) => {
          if (error) {
            NotificationManager.error(error);
          } else {
            setBook(book);
          }
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    if (bookIsbn) {
      BookApi.getBookByIsbn(bookIsbn)
        .then(({ book, error }) => {
          if (error) {
            NotificationManager.error(error);
          } else {
            setBook(book);
          }
        })
        .catch(console.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIsbn]);

  return (
    book && (
      <div className={classes.wrapper}>
        <Typography variant="h5" align="center" style={{ marginBottom: 20 }}>
          Detalles del libro
        </Typography>
        <Card>
          <Tabs
            value={openTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, tabIndex) => {
              setOpenTab(tabIndex);
              if (book && tabIndex > 0) {
                setChartOptions(
                  makeChartOptions(
                    tabIndex,
                    tabIndex === 1 ? book.priceHistory : book.quantityHistory
                  )
                );
              }
            }}
            centered
          >
            <Tab label="Detalles del libro" tabIndex={0} />
          </Tabs>

          <TabPanel value={openTab} index={0}>
            <CardContent>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell variant="head" component="th" width="200">
                      Nombre
                    </TableCell>
                    <TableCell>{book.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" component="th">
                      Clave
                    </TableCell>
                    <TableCell>{book.isbn}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" component="th">
                      Categoria
                    </TableCell>
                    <TableCell>{book.category}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" component="th">
                      Cantidad
                    </TableCell>
                    <TableCell>{book.quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell variant="head" component="th">
                      Disponibles
                    </TableCell>
                    <TableCell>{book.availableQuantity}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </TabPanel>

          <TabPanel value={openTab} index={1}>
            <CardContent>
              {book && book.priceHistory.length > 0 ? (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              ) : (
                <h3>No history found!</h3>
              )}
            </CardContent>
          </TabPanel>

          <TabPanel value={openTab} index={2}>
            <CardContent>
              {book && book.quantityHistory.length > 0 ? (
                <HighchartsReact highcharts={Highcharts} options={chartOptions} />
              ) : (
                <h3>No history found!</h3>
              )}
            </CardContent>
          </TabPanel>

          <CardActions disableSpacing>
            <div className={classes.btnContainer}>
              {isAdmin ? (
                <Button
                  variant="contained"
                  color="secondary"
                  component={RouterLink}
                  to={`/admin/books/${bookIsbn}/edit`}
                >
                  Editar libro
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={borrowBook}
                    disabled={book && user && book.borrowedBy.includes(user._id)}
                  >
                    Rentar
                  </Button>
                  <Button
                    variant="contained"
                    onClick={returnBook}
                    disabled={book && user && !book.borrowedBy.includes(user._id)}
                  >
                    Regresar Libro
                  </Button>
                </>
              )}
              <Button type="submit" variant="text" color="primary" onClick={() => navigate(-1)}>
                Regresar
              </Button>
            </div>
          </CardActions>
        </Card>
      </div>
    )
  );
};
