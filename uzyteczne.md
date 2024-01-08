## Zagnieżdżanie map oraz kod przy tworznieu komponentow

```
      <Box w={'800px'} h={'800px'} border={'solid'} position={'relative'} overflow={'hidden'}>
      {Array.from({ length: 16 }, (_, index) => {
        if (index % 2 === 0) {
          return (
            <div key={index}>
              {Array.from({ length: 5 }, (_, nestedIndex) => (
                <Box key={nestedIndex}>Parzysty - {nestedIndex}</Box>
              ))}
            </div>
          );
        } else {
          return (
            <div key={index}>
              {Array.from({ length: 3 }, (_, nestedIndex) => (
                <Box key={nestedIndex}>Nieparzysty - {nestedIndex}</Box>
              ))}
            </div>
          );
        }
      })}
      </Box>
```