export class Health {
  health(req, res) {
    res.status(200).send('API Gateway service is healthy');
  }
}
