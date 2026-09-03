const buckets = new Map();
function limiter(limit, windowMs, message) {
  return (req,res,next)=>{
    const key=`${req.ip}:${req.path}`; const now=Date.now(); const current=buckets.get(key);
    if(!current || now-current.start>windowMs){ buckets.set(key,{start:now,count:1}); return next(); }
    current.count += 1; if(current.count>limit) return res.status(429).json({message}); next();
  };
}
export const apiLimiter=limiter(300,15*60*1000,'Too many requests. Please try again later.');
export const authLimiter=limiter(20,15*60*1000,'Too many authentication attempts. Please try again later.');
export function validateObjectId(req,res,next){if(req.params.id && !/^[a-fA-F0-9]{24}$/.test(req.params.id))return res.status(400).json({message:'Invalid resource id'});next();}
