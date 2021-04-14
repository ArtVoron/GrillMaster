
import { Card, CardContent, Grid, Typography } from "@material-ui/core";

export const Header = () => {
  return (
    <Grid item lg={12} xs={12}>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Typography variant="h5">Grillmaster</Typography>
            </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
