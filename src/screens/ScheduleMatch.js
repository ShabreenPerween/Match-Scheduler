import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState, useMemo, useEffect} from 'react';
import {Calendar} from 'react-native-calendars';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {scheduleMatch, updateMatch} from '../redux/actions';

const ScheduleMatch = ({navigation, ...props}) => {
  const [selected, setSelected] = useState(moment().format('YYYY-MM-DD'));
  const [text, setText] = useState('');

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [existingSlots, setSlots] = useState();

  const data = useSelector(state => state.matchData);

  const dispatch = useDispatch();

  const marked = useMemo(
    () => ({
      [selected]: {
        selected: true,
        selectedColor: '#6d3797',
        selectedTextColor: '#ffffff',
      },
    }),
    [selected],
  );

  const setPreField = () => {
    if (props.route.params) {
      setSelected(props.route.params.date);
      setText(props.route.params.note);
      setStartTime(props.route.params.startTime);
      setEndTime(props.route.params.endTime);
    }
  };

  useEffect(() => {
    setPreField();
  }, []);

  const handleSchedule = () => {
    const matchObj = {
      date: selected,
      startTime: startTime,
      endTime: endTime,
      note: text,
    };

    if (props.route.params) {
      dispatch(updateMatch(matchObj, props.route.params.id));
      Alert.alert('', 'Match Update Successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } else {
      if (validation()) {
        matchObj.id = Math.random() + 10 + Math.random();
        dispatch(scheduleMatch(matchObj));
        Alert.alert('', 'Match Schedule Successfully.', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    }
  };

  const validation = () => {
    let status = true;
    const timeOverlap = checkOverlapping(selected, startTime, endTime);

    if (!selected) {
      Alert.alert('', 'Please select Date of schedule');
      status = false;
    } else if (!startTime) {
      Alert.alert('', 'Please select match Start time');
      status = false;
    } else if (!endTime) {
      Alert.alert('', 'Please select match End time');
      status = false;
    } else if (!text) {
      Alert.alert('', 'Please select Title of match');
      status = false;
    } else if (timeOverlap.isOverlap) {
      Alert.alert(
        '',
        'Selected slots is already booked. Please select another slots.',
      );
      status = false;
    }
    return status;
  };

  const checkOverlapping = (date, t1, t2) => {
    if (!t1 || !t2) {
      return {isOverlap: false, bookedSlots: []};
    }
    const bookedSlots = [];
    let isOverlap = false;
    data.map(item => {
      if (item.date === date) {
        bookedSlots.push(item);
        if (
          moment(item.startTime, 'hh:mm A').isSame(moment(t1, 'hh:mm A')) ||
          moment(item.startTime, 'hh:mm A').isSame(moment(t2, 'hh:mm A')) ||
          moment(item.startTime, 'hh:mm A').isBetween(
            moment(t1, 'hh:mm A'),
            moment(t2, 'hh:mm A'),
          ) ||
          moment(item.endTime, 'hh:mm A').isSame(moment(t1, 'hh:mm A')) ||
          moment(item.endTime, 'hh:mm A').isSame(moment(t2, 'hh:mm A')) ||
          moment(item.endTime, 'hh:mm A').isBetween(
            moment(t1, 'hh:mm A'),
            moment(t2, 'hh:mm A'),
          ) ||
          (moment(item.startTime, 'hh:mm A').isBefore(moment(t1, 'hh:mm A')) &&
            moment(item.endTime, 'hh:mm A').isAfter(moment(t2, 'hh:mm A')))
        ) {
          isOverlap = true;
        }
      }
    });

    return {isOverlap, bookedSlots};
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <View style={styles.titleView}>
        <Text style={styles.title}>Title</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Please enter title"
          placeholderTextColor={'#ABABAB'}
          multiline
          style={styles.textInput}
        />
      </View>

      <View>
        <Text style={styles.date}>Select Date</Text>
        <Calendar
          style={styles.calendarStyle}
          theme={styles.calendarTheme}
          markedDates={marked}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          hideExtraDays={true}
          enableSwipeMonths={true}
          initialDate={selected}
        />
      </View>

      <View style={styles.timeView}>
        <Text style={styles.time}>Select Time</Text>

        <View style={styles.timePicker}>
          <View style={styles.flex}>
            <Text style={styles.text}>From :</Text>
            <TouchableOpacity
              onPress={() => setOpenStart(true)}
              activeOpacity={0.5}
              style={styles.selectedTimeView}>
              <Text style={styles.selectedTime}>{startTime}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex}>
            <Text style={styles.text}>To :</Text>
            <TouchableOpacity
              onPress={() => setOpenEnd(true)}
              activeOpacity={0.5}
              style={styles.selectedTimeView}>
              <Text style={styles.selectedTime}>{endTime}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {existingSlots && (
          <View style={styles.hintView}>
            <Text style={styles.hintText}>
              Selected slots is already booked. Please select another slots.
            </Text>

            <Text style={styles.bookedSlots}>
              Booked slots on{' '}
              {moment(selected, 'YYYY-MM-DD').format('DD MMM YYYY')}:
            </Text>
            <FlatList
              data={existingSlots?.bookedSlots}
              contentContainerStyle={{marginTop: 10}}
              numColumns={2}
              renderItem={({item}) => {
                return (
                  <Text style={styles.slots}>
                    {item.startTime} - {item.endTime}
                  </Text>
                );
              }}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.button}
        onPress={handleSchedule}>
        <Text style={styles.buttonText}>Schedule</Text>
      </TouchableOpacity>
      <DatePicker
        maximumDate={endTime ? new Date(moment(endTime, 'hh:mm A')) : null}
        mode="time"
        modal
        open={openStart}
        date={startTime ? new Date(moment(startTime, 'hh:mm A')) : new Date()}
        onConfirm={newTime => {
          setOpenStart(false);
          const ov = checkOverlapping(selected, newTime, endTime);
          if (ov.isOverlap) {
            setSlots(ov);
          } else {
            setSlots();
            const tm = moment(newTime).format('hh:mm A');
            setStartTime(tm);
          }
        }}
        onCancel={() => {
          setOpenStart(false);
        }}
      />
      <DatePicker
        minimumDate={startTime ? new Date(moment(startTime, 'hh:mm A')) : null}
        mode="time"
        modal
        open={openEnd}
        date={endTime ? new Date(moment(endTime, 'hh:mm A')) : new Date()}
        onConfirm={newTime => {
          setOpenEnd(false);
          const ov = checkOverlapping(selected, startTime, newTime);
          if (ov.isOverlap) {
            setSlots(ov);
          } else {
            setSlots();
            const tm = moment(newTime).format('hh:mm A');
            setEndTime(tm);
          }
        }}
        onCancel={() => {
          setOpenEnd(false);
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  titleView: {
    marginTop: 20,
    marginHorizontal: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#f5edfb',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#000000',
  },
  date: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginHorizontal: 15,
    marginTop: 10,
  },
  calendarStyle: {
    borderRadius: 15,
    height: 380,
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: '#f5edfb',
  },
  calendarTheme: {
    calendarBackground: '#f5edfb',
    textSectionTitleColor: '#3e1f56',
    todayTextColor: '#3e1f56',
    arrowColor: '#3e1f56',
    monthTextColor: '#3e1f56',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '800',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  },
  timeView: {
    marginVertical: 10,
    marginHorizontal: 15,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 10,
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flex: {flex: 0.45},
  text: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 5,
    marginLeft: 5,
  },
  selectedTimeView: {
    backgroundColor: '#f5edfb',
    paddingLeft: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },
  selectedTime: {fontSize: 14, fontWeight: '500', color: '#3e1f56'},
  buttonText: {fontSize: 16, fontWeight: '600', color: '#ffffff'},
  hintView: {
    borderRadius: 15,
    marginTop: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#f5edfb',
  },
  hintText: {fontSize: 15, color: '#3e1f56', fontWeight: '800', marginTop: 5},
  slots: {
    marginBottom: 10,
    fontWeight: '500',
    color: '#fff',
    padding: 8,
    backgroundColor: '#6d3797',
    borderRadius: 10,
    marginRight: 5,
  },
  bookedSlots: {
    fontSize: 15,
    color: '#3e1f56',
    fontWeight: '500',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#8451cb',
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 20,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScheduleMatch;
