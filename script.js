const MAX_PAGES = 5;

const generateRandomColor = () => {
  const characters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const Item = ({ children, color, reference }) => {
  return (
    <div className="item" style={{ backgroundColor: color }} ref={reference}>
      {children}
    </div>
  );
};

const App = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [pages, setPages] = React.useState(0);
  const observer = React.useRef();

  React.useEffect(() => {
    updateItems();
    setPages((pages) => pages + 1);
  }, []);

  const lastItemRef = React.useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (pages < MAX_PAGES) {
            updateItems();
            setPages((pages) => pages + 1);
          } else {
            setHasMore(false);
          }
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const updateItems = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setItems((currItems) => {
      const lastItem = currItems.length;
      const updatedItems = [...currItems];
      for (let i = 1; i <= 5; i++) {
        const item = {
          count: lastItem + i,
          color: generateRandomColor()
        };
        updatedItems.push(item);
      }
      return updatedItems;
    });

    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <h1>Infinite Scroll Demo</h1>
      {items.map((item, index) =>
        index + 1 === items.length ? (
          <Item reference={lastItemRef} key={index} color={item.color}>
            {item.count}
          </Item>
        ) : (
          <Item key={index} color={item.color}>
            {item.count}
          </Item>
        )
      )}
      {isLoading && <div className="loader" />}
    </React.Fragment>
  );
};

const root = document.getElementById("root");
ReactDOM.render(<App />, root);
