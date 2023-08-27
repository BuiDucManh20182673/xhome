import React from 'react';
import { Page, Text, Font, Document, StyleSheet, Image, View } from '@react-pdf/renderer';
import { Table, TableCell, TableHeader, TableBody, DataTableCell } from "@david.kucsai/react-pdf-table";
// const arr = [1, 2, 3]
// Create styles
const MyDocument = (props) => {
  const collectSpace = function (string) {
    let arr = []
    let space = 0;
    while (space !== -1) {
      let index = string.indexOf(" ", space + 1);
      space = index
      if (index !== -1) {
        arr.push(index);
      }
    }
    return arr;
  }

  const cutString = function (string, number) {
    let str = string;
    // let num = number;
    let num = 0;
    let countFirst = 1;
    let countFinal = 1;
    let arrSpace = collectSpace(string);

    let lengthStr = arrSpace[0] ? arrSpace[0] : string.length
    let lengthStrFinal = arrSpace[arrSpace.length - 1] ? string.length - arrSpace[arrSpace.length - 1] : 0
    console.log("length  ", lengthStr);

    // cắt từ đầu chuỗi tới dầu cách đầu tiên

    if (lengthStr > number) {
      let lastNum = Math.ceil(lengthStr / number)
      do {
        console.log("count  ", countFirst);
        let indexCut = (countFirst * (number - 2)) + num
        console.log("index : ", indexCut);
        console.log("lastNum ccc : ", lastNum);
        str = [str.slice(0, indexCut), " ", str.slice(indexCut)].join('');
        num += 1;
        countFirst += 1;
      } while (countFirst <= lastNum)
    }
    // cắt từ dấu cách đầu tiên tới dấu cách cuối
    for (let i = 0; i < arrSpace.length - 1; i++) {
      console.log("first bbb ");

      if ((arrSpace[i + 1] - arrSpace[i]) > number) {
        let fisrtNum = Math.ceil(arrSpace[i] / number)
        let lastNum = Math.ceil(arrSpace[i + 1] / number)
        console.log("first", fisrtNum);
        console.log("last", lastNum);
        do {
          let indexCut = (fisrtNum * (number - 2)) + num
          str = [str.slice(0, indexCut), " ", str.slice(indexCut)].join('');
          num += 1;
          fisrtNum++;
        } while (fisrtNum <= lastNum)
      }

    }

    // cắt từ dấu cách cuối cùng tới cuối chuỗi

    if (lengthStrFinal > 0) {
      let lastNum = Math.ceil(lengthStrFinal / number)
      do {
        console.log("count dd  ", countFinal);
        let indexCut = arrSpace[arrSpace.length - 1] + (countFinal * (number - 2)) + num
        console.log("index dd : ", indexCut);
        console.log("lastNum dd : ", lastNum);
        str = [str.slice(0, indexCut), " ", str.slice(indexCut)].join('');
        num += 1;
        countFinal += 1;
      } while (countFinal <= lastNum)
    }

    // while (num < str.length) {
    //   let char = str.charAt(num);
    //   let preChar = str.charAt(num - 1);
    //   if (char !== " " && preChar !== " ") {
    //     str = [str.slice(0, num), " -", str.slice(num)].join('');
    //     // str.splice(num, 0, " -");
    //     num += 2;
    //   }
    //   num += (number + 1)
    // }

    return str;
  }


  return (
    // <div>abc</div>
    <Document>
      <Page style={styles.body} wrap>
        <Image
          // style={styles.image}
          src={window.location.origin + "/header_pdf.png"}
        />
        <Text style={styles.title}>Bảng mã vật liệu</Text>
        <View style={{ fontSize: 14 }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: 'Times-New-Roman', fontWeight: 'bold' }}>Mã Hợp đồng: </Text>
            <Text>{props.data.codeContract}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <Text style={{ fontFamily: 'Times-New-Roman', fontWeight: 'bold' }}>Họ và tên khách hàng: </Text>
            <Text>{props.data.customer}</Text>
          </View>
        </View>
        {props.data && props.data.areas.map((item, key) => {
          return (
            // Header
            <View key={key}>
              <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                <Text style={styles.area}>{item.area}</Text>
              </View>
              <Table
                data={item.listProduct}
              >
                <TableHeader>
                  <TableCell weighting={0.12} style={styles.headerContent}>Danh mục vật liệu</TableCell>
                  <TableCell weighting={0.2} style={styles.catalogAndImage}>Quyển</TableCell>
                  <TableCell weighting={0.1} style={styles.headerContent}>Mã</TableCell>
                  <TableCell weighting={0.3} style={styles.headerContent}>Mô tả</TableCell>
                  <TableCell weighting={0.2} style={styles.catalogAndImage}>Hình ảnh</TableCell>
                  {/* <TableCell weighting={0.3} style={styles.headerContent}>Kích thước</TableCell> */}
                  <TableCell weighting={0.2} style={styles.headerContent}>Ghi chú</TableCell>
                </TableHeader>
                <TableBody style={styles.rowConentLimit} >
                  <DataTableCell weighting={0.12} style={styles.bodyContentCenter} getContent={(r) => r.material} />
                  <DataTableCell weighting={0.2} style={styles.bodyCatalogAndImage} getContent={(r) => (<Image src={r.catalog_image ? r.catalog_image : "https://st.depositphotos.com/1987177/3470/v/600/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"} />)} />
                  <DataTableCell weighting={0.1} style={styles.bodyContentCenter} getContent={(r) => cutString(r.code, 7)} />
                  <DataTableCell weighting={0.3} style={styles.bodyContent} getContent={(r) => r.description ? r.description : ''} />
                  <DataTableCell weighting={0.2} style={styles.bodyCatalogAndImage} getContent={(r) => (<Image src={r.image_url ? r.image_url : "https://st.depositphotos.com/1987177/3470/v/600/depositphotos_34700099-stock-illustration-no-photo-available-or-missing.jpg"} />)} />
                  {/* <DataTableCell weighting={0.3} style={styles.bodyContent} getContent={(r) => r.size ? r.size : ''} /> */}
                  <DataTableCell weighting={0.2} style={styles.bodyContent} getContent={(r) => r.note ? r.note : ''} />
                </TableBody>
              </Table>
            </View>
          )
        })}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document >
  )
};

Font.register({
  family: 'Nunito-Black',
  src: window.location.origin + '/Nunito-Black.ttf'
});
Font.register({
  family: 'Nunito-Light',
  src: window.location.origin + '/Nunito-Light.ttf'
});
Font.register({
  family: 'Nunito-Regular',
  src: window.location.origin + '/Nunito-Regular.ttf'
});
Font.register({
  family: 'Nunito-SemiBold',
  src: window.location.origin + '/Nunito-SemiBold.ttf'
});
Font.register({
  family: 'Times-New-Roman',
  src: window.location.origin + '/Times-New-Roman-400.ttf'
});
const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 15,
    fontFamily: 'Times-New-Roman',
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Times-New-Roman',
    margin: '7 0',
    color: '#272727',
    textTransform: 'capitalize'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  headerContent: {
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: 'whitesmoke',
    padding: '5 7',
    fontFamily: 'Times-New-Roman',
    fontWeight: 'bold',
  },
  bodyContentCenter: {
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: 'white',
    padding: '5 7',
    fontWeight: 'light',
    textOverflow: "wrap"
  },
  bodyContent: {
    // textAlign: 'center',
    width: 10,
    fontSize: 10,
    backgroundColor: 'white',
    padding: '5 7',
    fontWeight: 'normal',
    display: "block",
    textOverflow: "wrap",
    // display: "table",
    // flexWrap: "wrap",
    // flexDirection: "column",
    // over
  },
  catalogAndImage: {
    textAlign: 'center',
    fontSize: 12,
    backgroundColor: 'whitesmoke',
    padding: '5 5',
    fontFamily: 'Times-New-Roman',
    fontWeight: 'bold'
  },
  bodyCatalogAndImage: {
    textAlign: 'center',
    fontSize: 10,
    backgroundColor: 'white',
    padding: '5 5',
    fontWeight: 'normal'
  },
  area: {
    textDecoration: 'underline',
    fontFamily: 'Times-New-Roman',
    color: '#272727'
  },
  rowConentLimit: {
    height: "50%"
  },
});

// ReactPDF.render(<Quixote />);

export default MyDocument;