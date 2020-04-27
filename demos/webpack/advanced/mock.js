module.exports = {
    'GET /userInfo/:id': (req, res) => {
        const { id } = req.params;
        return res.json({
          id,
          name: '阿白smile'
        });
    }
}