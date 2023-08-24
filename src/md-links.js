export function validateLinks(links){
    const promises = links.map((link) => 
      fetch(link.links)
      .then((response) => {
        link.status = response.status;
        link.ok = response.ok ? 'OK' : 'FAIL';
        return link
      })
      .catch(() => {
        link.status = 404;
        link.ok = 'FAIL';
        return link;
      })
    )
    return Promise.all(promises);
  }
  