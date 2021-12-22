module.exports = (req,resp,next)=>{
    if (!req.session.isAuthanticated) {
      return  resp.redirect('/')
        
    }
    next()
}