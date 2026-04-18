export async function GET(
    req: Request,
    context: { params: Promise<{ path: string[] }> }
  ) {
    const { params } = context;
    const resolvedParams = await params;
  
    const path = resolvedParams.path?.join('/') ?? '';
  
    const url = new URL(req.url);
  
    console.log('➡️ proxy hit:', path);
  
    const target = `http://localhost:3002/api/${path}${url.search}`;
  
    console.log('➡️ calling:', target);
  
    const res = await fetch(target);
    const data = await res.json();
  
    return Response.json(data);
  }